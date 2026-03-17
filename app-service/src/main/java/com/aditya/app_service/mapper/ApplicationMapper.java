package com.aditya.app_service.mapper;

import com.aditya.app_service.DTO.ApplicationResponseDTO;
import com.aditya.app_service.entity.Application;

public class ApplicationMapper {

    public static ApplicationResponseDTO toDTO(Application app) {
        ApplicationResponseDTO dto = new ApplicationResponseDTO();
        dto.setId(app.getId());
        dto.setName(app.getName());
        dto.setDescription(app.getDescription());
        dto.setVersion(app.getVersion());
        dto.setGenre(app.getGenre() != null ? app.getGenre().name() : null);
        dto.setRating(app.getRating());
        dto.setVisible(app.getVisible());
        dto.setOwnerEmail(app.getOwnerEmail());
        dto.setCategory(app.getCategory() != null
                ? CategoryMapper.toDTO(app.getCategory()) : null);
        dto.setCreatedDate(app.getCreatedDate() != null
                ? app.getCreatedDate().toString() : null);
        dto.setUpdatedDate(app.getUpdatedDate() != null
                ? app.getUpdatedDate().toString() : null);
        return dto;
    }
}
