package com.aditya.interaction_service.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequestDTO {
    private Long appId;
    private Integer rating;   // 1 to 5
    private String comment;
}
