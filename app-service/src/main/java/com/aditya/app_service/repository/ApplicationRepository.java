package com.aditya.app_service.repository;

import com.aditya.app_service.entity.Application;
import com.aditya.app_service.enums.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByVisibleTrue();
    List<Application> findByOwnerEmail(String ownerEmail);
    List<Application> findByCategoryId(Long categoryId);
    List<Application> findByNameContainingIgnoreCaseAndVisibleTrue(String name);
    List<Application> findByGenreAndVisibleTrue(Genre genre);
    List<Application> findByRatingGreaterThanEqualAndVisibleTrue(Double rating);
}
