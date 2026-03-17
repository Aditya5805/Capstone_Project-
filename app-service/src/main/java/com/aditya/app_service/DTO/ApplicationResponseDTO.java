package com.aditya.app_service.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponseDTO {
    private Long id;
    private String name;
    private String description;
    private String version;
    private String genre;
    private Double rating;
    private Boolean visible;
    private String ownerEmail;
    private CategoryDTO category;
    private String createdDate;
    private String updatedDate;
}
