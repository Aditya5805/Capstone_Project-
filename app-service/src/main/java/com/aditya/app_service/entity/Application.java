package com.aditya.app_service.entity;

import com.aditya.app_service.enums.Genre;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    private String version;

    @Enumerated(EnumType.STRING)
    private Genre genre;

    private Double rating;

    private Boolean visible;

    // ownerEmail links to User in auth-service (no FK across microservices)
    private String ownerEmail;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
}
