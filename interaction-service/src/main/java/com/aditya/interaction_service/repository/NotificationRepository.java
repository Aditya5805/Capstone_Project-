package com.aditya.interaction_service.repository;

import com.aditya.interaction_service.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientEmail(String recipientEmail);
    List<Notification> findByRecipientEmailAndIsRead(String recipientEmail, Boolean isRead);
    List<Notification> findByAppId(Long appId);
}
