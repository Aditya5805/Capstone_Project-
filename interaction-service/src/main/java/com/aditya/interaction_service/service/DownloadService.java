package com.aditya.interaction_service.service;

import com.aditya.interaction_service.DTO.AppResponseDTO;
import com.aditya.interaction_service.DTO.DownloadRequestDTO;
import com.aditya.interaction_service.DTO.DownloadResponseDTO;
import com.aditya.interaction_service.client.AppClient;
import com.aditya.interaction_service.entity.Download;
import com.aditya.interaction_service.mapper.DownloadMapper;
import com.aditya.interaction_service.repository.DownloadRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DownloadService {

    private final DownloadRepository downloadRepository;
    private final NotificationService notificationService;
    private final AppClient appClient;

    public DownloadResponseDTO downloadApp(DownloadRequestDTO request, String userEmail) {

        // Save download record
        Download download = new Download();
        download.setAppId(request.getAppId());
        download.setUserEmail(userEmail);
        download.setDownloadedAt(LocalDateTime.now());
        Download saved = downloadRepository.save(download);

        // Feign call to app-service to get app name + ownerEmail
        try {
            AppResponseDTO app = appClient.getAppById(request.getAppId());

            if (app != null && app.getOwnerEmail() != null) {
                // Notify OWNER
                notificationService.createNotification(
                        app.getOwnerEmail(),
                        request.getAppId(),
                        "Your app \"" + app.getName() + "\" was downloaded by " + userEmail
                );
                // Notify USER
                notificationService.createNotification(
                        userEmail,
                        request.getAppId(),
                        "You downloaded \"" + app.getName() + "\" successfully!"
                );
                log.info("Notifications sent — owner: {}, user: {}", app.getOwnerEmail(), userEmail);
            }

        } catch (Exception e) {
            log.error("Feign call failed for appId {}: {}", request.getAppId(), e.getMessage());
            // Fallback — still notify user even if app-service is unreachable
            notificationService.createNotification(
                    userEmail,
                    request.getAppId(),
                    "You downloaded app #" + request.getAppId() + " successfully!"
            );
        }

        return DownloadMapper.toDTO(saved);
    }

    public List<DownloadResponseDTO> getMyDownloads(String userEmail) {
        return downloadRepository.findByUserEmail(userEmail)
                .stream().map(DownloadMapper::toDTO).collect(Collectors.toList());
    }

    public List<DownloadResponseDTO> getDownloadsByApp(Long appId) {
        return downloadRepository.findByAppId(appId)
                .stream().map(DownloadMapper::toDTO).collect(Collectors.toList());
    }

    public long getDownloadCount(Long appId) {
        return downloadRepository.countByAppId(appId);
    }

    public boolean hasUserDownloaded(Long appId, String userEmail) {
        return downloadRepository.existsByAppIdAndUserEmail(appId, userEmail);
    }
}
