package com.aditya.interaction_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Who receives this notification
    private String recipientEmail;

    // Which app triggered it (nullable for system notifications)
    private Long appId;

    @Column(nullable = false)
    private String message;

    private Boolean isRead;

    private LocalDateTime createdAt;
}
