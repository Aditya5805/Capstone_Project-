package com.aditya.interaction_service.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponseDTO {
    private Long id;
    private String recipientEmail;
    private Long appId;
    private String message;
    private Boolean isRead;
    private String createdAt;
}
