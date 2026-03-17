package com.aditya.app_service.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationRequestDTO {
    private String name;
    private String description;
    private String version;
    private String genre;       // matches Genre enum name e.g. "ACTION"
    private Boolean visible;
    private Long categoryId;
}
