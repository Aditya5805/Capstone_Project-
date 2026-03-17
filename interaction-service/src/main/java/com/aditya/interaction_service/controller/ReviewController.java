package com.aditya.interaction_service.controller;

import com.aditya.interaction_service.DTO.ReviewRequestDTO;
import com.aditya.interaction_service.DTO.ReviewResponseDTO;
import com.aditya.interaction_service.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // USER — submit or update a review (upsert by composite key)
    @PostMapping
    public ResponseEntity<ReviewResponseDTO> submitReview(
            @RequestBody ReviewRequestDTO request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(reviewService.submitReview(request, userEmail));
    }

    // Public — all reviews for a specific app
    @GetMapping("/app/{appId}")
    public ResponseEntity<List<ReviewResponseDTO>> getReviewsByApp(@PathVariable Long appId) {
        return ResponseEntity.ok(reviewService.getReviewsByApp(appId));
    }

    // Public — get average rating for an app
    @GetMapping("/app/{appId}/average")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long appId) {
        return ResponseEntity.ok(reviewService.getAverageRating(appId));
    }


    // USER — all reviews they have written
    @GetMapping("/my")
    public ResponseEntity<List<ReviewResponseDTO>> getMyReviews(Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(reviewService.getMyReviews(userEmail));
    }

    // USER — their specific review for one app
    @GetMapping("/my/app/{appId}")
    public ResponseEntity<ReviewResponseDTO> getMyReviewForApp(
            @PathVariable Long appId,
            Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(reviewService.getMyReviewForApp(appId, userEmail));
    }

    // USER — delete their own review for an app
    @DeleteMapping("/app/{appId}")
    public ResponseEntity<String> deleteReview(
            @PathVariable Long appId,
            Authentication authentication) {
        String userEmail = authentication.getName();
        reviewService.deleteReview(appId, userEmail);
        return ResponseEntity.ok("Review deleted successfully");
    }
}
