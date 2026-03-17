package com.aditya.interaction_service.repository;

import com.aditya.interaction_service.entity.Review;
import com.aditya.interaction_service.entity.ReviewId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, ReviewId> {
    List<Review> findByIdAppId(Long appId);
    List<Review> findByIdUserEmail(String userEmail);
}
