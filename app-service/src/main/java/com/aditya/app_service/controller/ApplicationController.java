package com.aditya.app_service.controller;

import com.aditya.app_service.DTO.ApplicationRequestDTO;
import com.aditya.app_service.DTO.ApplicationResponseDTO;
import com.aditya.app_service.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/apps")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    // OWNER — create app; ownerEmail extracted from JWT via Authentication
    @PostMapping
    public ResponseEntity<ApplicationResponseDTO> createApplication(
            @RequestBody ApplicationRequestDTO request,
            Authentication authentication) {
        String ownerEmail = authentication.getName();
        return ResponseEntity.ok(applicationService.createApplication(request, ownerEmail));
    }

    // Public — all visible apps
    @GetMapping
    public ResponseEntity<List<ApplicationResponseDTO>> getAllVisibleApps() {
        return ResponseEntity.ok(applicationService.getAllVisibleApplications());
    }

    // Public — single app by id
    @GetMapping("/{id}")
    public ResponseEntity<ApplicationResponseDTO> getAppById(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }

    // OWNER — update their app
    @PutMapping("/{id}")
    public ResponseEntity<ApplicationResponseDTO> updateApp(
            @PathVariable Long id,
            @RequestBody ApplicationRequestDTO request,
            Authentication authentication) {
        String ownerEmail = authentication.getName();
        return ResponseEntity.ok(applicationService.updateApplication(id, request, ownerEmail));
    }

    // OWNER — delete their app
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteApp(
            @PathVariable Long id,
            Authentication authentication) {
        String ownerEmail = authentication.getName();
        applicationService.deleteApplication(id, ownerEmail);
        return ResponseEntity.ok("Application deleted successfully");
    }

    // OWNER — toggle visibility
    @PatchMapping("/{id}/visibility")
    public ResponseEntity<ApplicationResponseDTO> toggleVisibility(
            @PathVariable Long id,
            Authentication authentication) {
        String ownerEmail = authentication.getName();
        return ResponseEntity.ok(applicationService.toggleVisibility(id, ownerEmail));
    }

    // OWNER — list their own apps
    @GetMapping("/my")
    public ResponseEntity<List<ApplicationResponseDTO>> getMyApps(Authentication authentication) {
        String ownerEmail = authentication.getName();
        return ResponseEntity.ok(applicationService.getMyApplications(ownerEmail));
    }

    // Public — search by name
    @GetMapping("/search")
    public ResponseEntity<List<ApplicationResponseDTO>> search(@RequestParam String name) {
        return ResponseEntity.ok(applicationService.searchByName(name));
    }

    // Public — filter by category
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ApplicationResponseDTO>> getByCategory(
            @PathVariable Long categoryId) {
        return ResponseEntity.ok(applicationService.getByCategory(categoryId));
    }

    // Public — filter by genre
    @GetMapping("/genre/{genre}")
    public ResponseEntity<List<ApplicationResponseDTO>> getByGenre(@PathVariable String genre) {
        return ResponseEntity.ok(applicationService.getByGenre(genre));
    }

    // Called internally by interaction-service to update avg rating after a review
    @PatchMapping("/{id}/rating")
    public ResponseEntity<Void> updateRating(
            @PathVariable Long id,
            @RequestParam Double rating) {
        applicationService.updateRating(id, rating);
        return ResponseEntity.ok().build();
    }

    // Public — filter by minimum rating
    @GetMapping("/rating")
    public ResponseEntity<List<ApplicationResponseDTO>> getByRating(@RequestParam Double min) {
        return ResponseEntity.ok(applicationService.getByMinRating(min));
    }
}
