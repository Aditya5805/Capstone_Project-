package com.aditya.interaction_service.mapper;

import com.aditya.interaction_service.DTO.DownloadResponseDTO;
import com.aditya.interaction_service.entity.Download;

public class DownloadMapper {

    public static DownloadResponseDTO toDTO(Download download) {
        DownloadResponseDTO dto = new DownloadResponseDTO();
        dto.setId(download.getId());
        dto.setAppId(download.getAppId());
        dto.setUserEmail(download.getUserEmail());
        dto.setDownloadedAt(download.getDownloadedAt() != null
                ? download.getDownloadedAt().toString() : null);
        return dto;
    }
}
