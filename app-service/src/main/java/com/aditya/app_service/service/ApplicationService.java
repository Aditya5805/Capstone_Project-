package com.aditya.app_service.service;

import com.aditya.app_service.DTO.ApplicationRequestDTO;
import com.aditya.app_service.DTO.ApplicationResponseDTO;
import com.aditya.app_service.entity.Application;
import com.aditya.app_service.entity.Category;
import com.aditya.app_service.enums.Genre;
import com.aditya.app_service.exception.ResourceNotFoundException;
import com.aditya.app_service.mapper.ApplicationMapper;
import com.aditya.app_service.repository.ApplicationRepository;
import com.aditya.app_service.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final CategoryRepository categoryRepository;

    public void updateRating(Long id, Double newRating) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Application not found with ID: " + id));
        app.setRating(newRating);
        app.setUpdatedDate(LocalDateTime.now());
        applicationRepository.save(app);
    }

    // OWNER creates an app — ownerEmail comes from the JWT principal
    public ApplicationResponseDTO createApplication(ApplicationRequestDTO request, String ownerEmail) {
        Application app = new Application();
        app.setName(request.getName());
        app.setDescription(request.getDescription());
        app.setVersion(request.getVersion());
        app.setGenre(Genre.valueOf(request.getGenre().toUpperCase()));
        app.setVisible(request.getVisible() != null ? request.getVisible() : true);
        app.setRating(0.0);
        app.setOwnerEmail(ownerEmail);
        app.setCreatedDate(LocalDateTime.now());
        app.setUpdatedDate(LocalDateTime.now());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Category not found with ID: " + request.getCategoryId()));
            app.setCategory(category);
        }

        return ApplicationMapper.toDTO(applicationRepository.save(app));
    }

    // Public — all visible apps
    public List<ApplicationResponseDTO> getAllVisibleApplications() {
        return applicationRepository.findByVisibleTrue()
                .stream().map(ApplicationMapper::toDTO).collect(Collectors.toList());
    }

    // All apps — for internal/admin use
    public List<ApplicationResponseDTO> getAllApplications() {
        return applicationRepository.findAll()
                .stream().map(ApplicationMapper::toDTO).collect(Collectors.toList());
    }

    public ApplicationResponseDTO getApplicationById(Long id) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Application not found with ID: " + id));
        return ApplicationMapper.toDTO(app);
    }

    // OWNER updates their own app
    public ApplicationResponseDTO updateApplication(Long id, ApplicationRequestDTO request, String ownerEmail) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Application not found with ID: " + id));

        if (!app.getOwnerEmail().equals(ownerEmail)) {
            throw new IllegalArgumentException("You are not the owner of this application");
        }

        app.setName(request.getName());
        app.setDescription(request.getDescription());
        app.setVersion(request.getVersion());
        app.setGenre(Genre.valueOf(request.getGenre().toUpperCase()));
        if (request.getVisible() != null) app.setVisible(request.getVisible());
        app.setUpdatedDate(LocalDateTime.now());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Category not found with ID: " + request.getCategoryId()));
            app.setCategory(category);
        }

        return ApplicationMapper.toDTO(applicationRepository.save(app));
    }

    // OWNER deletes their own app
    public void deleteApplication(Long id, String ownerEmail) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Application not found with ID: " + id));

        if (!app.getOwnerEmail().equals(ownerEmail)) {
            throw new IllegalArgumentException("You are not the owner of this application");
        }

        applicationRepository.deleteById(id);
    }

    // Search by name (public)
    public List<ApplicationResponseDTO> searchByName(String name) {
        return applicationRepository.findByNameContainingIgnoreCaseAndVisibleTrue(name)
                .stream().map(ApplicationMapper::toDTO).collect(Collectors.toList());
    }

    // Filter by category (public)
    public List<ApplicationResponseDTO> getByCategory(Long categoryId) {
        return applicationRepository.findByCategoryId(categoryId)
                .stream().map(ApplicationMapper::toDTO).collect(Collectors.toList());
    }

    // Filter by genre (public)
    public List<ApplicationResponseDTO> getByGenre(String genre) {
        return applicationRepository.findByGenreAndVisibleTrue(
                        Genre.valueOf(genre.toUpperCase()))
                .stream().map(ApplicationMapper::toDTO).collect(Collectors.toList());
    }

    // Filter by minimum rating (public)
    public List<ApplicationResponseDTO> getByMinRating(Double rating) {
        return applicationRepository.findByRatingGreaterThanEqualAndVisibleTrue(rating)
                .stream().map(ApplicationMapper::toDTO).collect(Collectors.toList());
    }

    // OWNER views their own apps
    public List<ApplicationResponseDTO> getMyApplications(String ownerEmail) {
        return applicationRepository.findByOwnerEmail(ownerEmail)
                .stream().map(ApplicationMapper::toDTO).collect(Collectors.toList());
    }

    // OWNER toggles visibility of their app
    public ApplicationResponseDTO toggleVisibility(Long id, String ownerEmail) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Application not found with ID: " + id));

        if (!app.getOwnerEmail().equals(ownerEmail)) {
            throw new IllegalArgumentException("You are not the owner of this application");
        }

        app.setVisible(!app.getVisible());
        app.setUpdatedDate(LocalDateTime.now());
        return ApplicationMapper.toDTO(applicationRepository.save(app));
    }
}
