package com.aditya.interaction_service.service;

import com.aditya.interaction_service.DTO.NotificationResponseDTO;
import com.aditya.interaction_service.entity.Notification;
import com.aditya.interaction_service.exception.ResourceNotFoundException;
import com.aditya.interaction_service.mapper.NotificationMapper;
import com.aditya.interaction_service.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    // Internal method — called by DownloadService and other services
    public void createNotification(String recipientEmail, Long appId, String message) {
        Notification notification = new Notification();
        notification.setRecipientEmail(recipientEmail);
        notification.setAppId(appId);
        notification.setMessage(message);
        notification.setIsRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }

    // OWNER announces an update — sends notification to all users who downloaded the app
    // recipient list is passed in from controller (future: resolved via app-service)
    public void announceUpdate(Long appId, String updateMessage, List<String> recipientEmails) {
        for (String email : recipientEmails) {
            createNotification(email, appId, updateMessage);
        }
    }

    // USER/OWNER — get all their notifications
    public List<NotificationResponseDTO> getMyNotifications(String recipientEmail) {
        return notificationRepository.findByRecipientEmail(recipientEmail)
                .stream().map(NotificationMapper::toDTO).collect(Collectors.toList());
    }

    // USER/OWNER — get only unread notifications
    public List<NotificationResponseDTO> getUnreadNotifications(String recipientEmail) {
        return notificationRepository.findByRecipientEmailAndIsRead(recipientEmail, false)
                .stream().map(NotificationMapper::toDTO).collect(Collectors.toList());
    }

    // USER/OWNER — mark a notification as read
    public NotificationResponseDTO markAsRead(Long notificationId, String recipientEmail) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Notification not found with ID: " + notificationId));

        if (!notification.getRecipientEmail().equals(recipientEmail)) {
            throw new IllegalArgumentException("This notification does not belong to you");
        }

        notification.setIsRead(true);
        return NotificationMapper.toDTO(notificationRepository.save(notification));
    }

    // USER/OWNER — mark all their notifications as read
    public void markAllAsRead(String recipientEmail) {
        List<Notification> unread = notificationRepository
                .findByRecipientEmailAndIsRead(recipientEmail, false);
        unread.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(unread);
    }

    // Delete a notification
    public void deleteNotification(Long notificationId, String recipientEmail) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Notification not found with ID: " + notificationId));

        if (!notification.getRecipientEmail().equals(recipientEmail)) {
            throw new IllegalArgumentException("This notification does not belong to you");
        }

        notificationRepository.deleteById(notificationId);
    }
}
