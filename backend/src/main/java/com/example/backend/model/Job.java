package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private User company;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    private String location;

    private String salary;

    private LocalDateTime deadline;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    // Eligibility Criteria
    private Double minCgpa;

    private Integer maxBacklogs;

    @ElementCollection
    private List<String> allowedBranches;

    private String bondDetails;
}
