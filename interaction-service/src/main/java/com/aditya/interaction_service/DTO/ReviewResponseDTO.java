package com.aditya.interaction_service.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponseDTO {
    private Long appId;
    private String userEmail;
    private Integer rating;
    private String comment;
    private String createdDate;
    private String updatedDate;
}
