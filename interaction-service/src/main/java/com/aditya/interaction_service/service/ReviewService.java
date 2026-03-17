package com.aditya.interaction_service.service;

import com.aditya.interaction_service.DTO.ReviewRequestDTO;
import com.aditya.interaction_service.DTO.ReviewResponseDTO;
import com.aditya.interaction_service.client.AppClient;
import com.aditya.interaction_service.entity.Review;
import com.aditya.interaction_service.entity.ReviewId;
import com.aditya.interaction_service.exception.ResourceNotFoundException;
import com.aditya.interaction_service.mapper.ReviewMapper;
import com.aditya.interaction_service.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final AppClient appClient;

    public ReviewResponseDTO submitReview(ReviewRequestDTO request, String userEmail) {
        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        ReviewId reviewId = new ReviewId(request.getAppId(), userEmail);
        Review review = reviewRepository.findById(reviewId).orElse(new Review());
        boolean isNew = review.getId() == null;

        review.setId(reviewId);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setUpdatedDate(LocalDateTime.now());
        if (isNew) review.setCreatedDate(LocalDateTime.now());

        ReviewResponseDTO saved = ReviewMapper.toDTO(reviewRepository.save(review));

        // Recalculate average and push to app-service
        syncRating(request.getAppId());

        return saved;
    }

    public double getAverageRating(Long appId) {
        List<Review> reviews = reviewRepository.findByIdAppId(appId);

        if (reviews.isEmpty()) return 0.0;

        double avg = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        return Math.round(avg * 10.0) / 10.0; // round to 1 decimal
    }



    public List<ReviewResponseDTO> getReviewsByApp(Long appId) {
        return reviewRepository.findByIdAppId(appId)
                .stream().map(ReviewMapper::toDTO).collect(Collectors.toList());
    }

    public List<ReviewResponseDTO> getMyReviews(String userEmail) {
        return reviewRepository.findByIdUserEmail(userEmail)
                .stream().map(ReviewMapper::toDTO).collect(Collectors.toList());
    }

    public ReviewResponseDTO getMyReviewForApp(Long appId, String userEmail) {
        ReviewId reviewId = new ReviewId(appId, userEmail);
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No review found for appId " + appId + " by " + userEmail));
        return ReviewMapper.toDTO(review);
    }

    public void deleteReview(Long appId, String userEmail) {
        ReviewId reviewId = new ReviewId(appId, userEmail);
        if (!reviewRepository.existsById(reviewId)) {
            throw new ResourceNotFoundException(
                    "No review found for appId " + appId + " by " + userEmail);
        }
        reviewRepository.deleteById(reviewId);

        // Recalculate average after deletion
        syncRating(appId);
    }

    // ── Private ───────────────────────────────────────────────────────────────

    private void syncRating(Long appId) {
        try {
            List<Review> reviews = reviewRepository.findByIdAppId(appId);

            double avg = reviews.isEmpty() ? 0.0
                    : reviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);

            // Round to 1 decimal: 4.333 → 4.3
            double rounded = Math.round(avg * 10.0) / 10.0;

            // Feign → PATCH http://localhost:8081/apps/{appId}/rating?rating=4.3
            appClient.updateRating(appId, rounded);

            log.info("Synced rating for app {} → {}", appId, rounded);

        } catch (Exception e) {
            // Never fail the review submission because of rating sync
            log.error("Rating sync failed for app {}: {}", appId, e.getMessage());
        }
    }
}