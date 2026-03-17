package com.aditya.interaction_service.mapper;

import com.aditya.interaction_service.DTO.ReviewResponseDTO;
import com.aditya.interaction_service.entity.Review;

public class ReviewMapper {

    public static ReviewResponseDTO toDTO(Review review) {
        ReviewResponseDTO dto = new ReviewResponseDTO();
        dto.setAppId(review.getId().getAppId());
        dto.setUserEmail(review.getId().getUserEmail());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedDate(review.getCreatedDate() != null
                ? review.getCreatedDate().toString() : null);
        dto.setUpdatedDate(review.getUpdatedDate() != null
                ? review.getUpdatedDate().toString() : null);
        return dto;
    }
}
