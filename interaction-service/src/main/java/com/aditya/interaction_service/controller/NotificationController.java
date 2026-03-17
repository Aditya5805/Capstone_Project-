package com.aditya.interaction_service.controller;

import com.aditya.interaction_service.DTO.NotificationResponseDTO;
import com.aditya.interaction_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // USER/OWNER — get all their notifications
    @GetMapping
    public ResponseEntity<List<NotificationResponseDTO>> getMyNotifications(
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(notificationService.getMyNotifications(email));
    }

    // USER/OWNER — get only unread notifications
    @GetMapping("/unread")
    public ResponseEntity<List<NotificationResponseDTO>> getUnread(
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(notificationService.getUnreadNotifications(email));
    }

    // USER/OWNER — mark a single notification as read
    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationResponseDTO> markAsRead(
            @PathVariable Long id,
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(notificationService.markAsRead(id, email));
    }

    // USER/OWNER — mark all notifications as read
    @PatchMapping("/read-all")
    public ResponseEntity<String> markAllAsRead(Authentication authentication) {
        String email = authentication.getName();
        notificationService.markAllAsRead(email);
        return ResponseEntity.ok("All notifications marked as read");
    }

    // OWNER — announce an app update, sends notification to a list of users
    // Body: { "appId": 1, "message": "v2.0 is here!", "recipients": ["a@b.com", "c@d.com"] }
    @PostMapping("/announce")
    public ResponseEntity<String> announceUpdate(
            @RequestBody AnnounceRequest request,
            Authentication authentication) {
        notificationService.announceUpdate(
                request.getAppId(),
                request.getMessage(),
                request.getRecipients()
        );
        return ResponseEntity.ok("Update announcement sent to " + request.getRecipients().size() + " users");
    }

    // USER/OWNER — delete a notification
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNotification(
            @PathVariable Long id,
            Authentication authentication) {
        String email = authentication.getName();
        notificationService.deleteNotification(id, email);
        return ResponseEntity.ok("Notification deleted successfully");
    }

    // Inner DTO for announce endpoint — keeps it self-contained in controller
    @lombok.Getter
    @lombok.Setter
    @lombok.NoArgsConstructor
    public static class AnnounceRequest {
        private Long appId;
        private String message;
        private List<String> recipients;
    }
}
