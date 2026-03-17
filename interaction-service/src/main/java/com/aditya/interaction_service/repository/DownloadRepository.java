package com.aditya.interaction_service.repository;

import com.aditya.interaction_service.entity.Download;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DownloadRepository extends JpaRepository<Download, Long> {
    List<Download> findByUserEmail(String userEmail);
    List<Download> findByAppId(Long appId);
    boolean existsByAppIdAndUserEmail(Long appId, String userEmail);
    long countByAppId(Long appId);
}
