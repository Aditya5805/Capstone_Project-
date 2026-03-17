package com.aditya.interaction_service.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppResponseDTO {
    private Long id;
    private String name;
    private String ownerEmail;
    private String version;
    private String genre;
    private Boolean visible;
}