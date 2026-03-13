package com.example.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "student_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String rollNumber;

    private String branch;

    private String batchYear;

    private Double cgpa;

    private String resumeUrl;

    @ElementCollection
    private List<String> skills;

    // Academic Details
    private Double cgpa10th;

    private Double cgpa12th;

    private Integer activeBacklogs;

    // Portfolio & Links
    private String linkedinUrl;

    private String githubUrl;

    private String leetcodeUrl;
    
    @Column(columnDefinition = "TEXT")
    private String bptrcShowcase;

    // BIRD Exchange Details
    private String passportNumber;

    private LocalDate passportExpiry;

    private String visaStatus;
}
