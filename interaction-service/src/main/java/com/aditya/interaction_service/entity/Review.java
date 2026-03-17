package com.aditya.interaction_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    // Composite primary key: one review per user per app
    @EmbeddedId
    private ReviewId id;

    @Column(nullable = false)
    private Integer rating;         // 1 to 5

    private String comment;

    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
}
