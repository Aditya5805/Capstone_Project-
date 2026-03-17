package com.aditya.interaction_service.controller;

import com.aditya.interaction_service.DTO.DownloadRequestDTO;
import com.aditya.interaction_service.DTO.DownloadResponseDTO;
import com.aditya.interaction_service.service.DownloadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/downloads")
@RequiredArgsConstructor
public class DownloadController {

    private final DownloadService downloadService;

    // USER — download an app
    @PostMapping
    public ResponseEntity<DownloadResponseDTO> downloadApp(
            @RequestBody DownloadRequestDTO request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(downloadService.downloadApp(request, userEmail));
    }

    // USER — view their own download history
    @GetMapping("/my")
    public ResponseEntity<List<DownloadResponseDTO>> getMyDownloads(Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(downloadService.getMyDownloads(userEmail));
    }

    // OWNER — view all downloads for their app
    @GetMapping("/app/{appId}")
    public ResponseEntity<List<DownloadResponseDTO>> getDownloadsByApp(@PathVariable Long appId) {
        return ResponseEntity.ok(downloadService.getDownloadsByApp(appId));
    }

    // OWNER — total download count for their app
    @GetMapping("/app/{appId}/count")
    public ResponseEntity<Long> getDownloadCount(@PathVariable Long appId) {
        return ResponseEntity.ok(downloadService.getDownloadCount(appId));
    }

    // USER — check if they have already downloaded an app
    @GetMapping("/app/{appId}/check")
    public ResponseEntity<Boolean> hasDownloaded(
            @PathVariable Long appId,
            Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(downloadService.hasUserDownloaded(appId, userEmail));
    }
}
