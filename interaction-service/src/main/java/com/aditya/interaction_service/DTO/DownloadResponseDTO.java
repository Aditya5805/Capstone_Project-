package com.aditya.interaction_service.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DownloadResponseDTO {
    private Long id;
    private Long appId;
    private String userEmail;
    private String downloadedAt;
}
