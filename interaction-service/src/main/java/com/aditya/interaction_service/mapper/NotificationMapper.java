package com.aditya.interaction_service.mapper;

import com.aditya.interaction_service.DTO.NotificationResponseDTO;
import com.aditya.interaction_service.entity.Notification;

public class NotificationMapper {

    public static NotificationResponseDTO toDTO(Notification notification) {
        NotificationResponseDTO dto = new NotificationResponseDTO();
        dto.setId(notification.getId());
        dto.setRecipientEmail(notification.getRecipientEmail());
        dto.setAppId(notification.getAppId());
        dto.setMessage(notification.getMessage());
        dto.setIsRead(notification.getIsRead());
        dto.setCreatedAt(notification.getCreatedAt() != null
                ? notification.getCreatedAt().toString() : null);
        return dto;
    }
}
