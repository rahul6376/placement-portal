package com.example.backend.controller;

import com.example.backend.model.Application;
import com.example.backend.model.ApplicationStatus;
import com.example.backend.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    // Student can view their own applications
    @GetMapping("/student/{studentId}")
    public List<Application> getStudentApplications(@PathVariable Long studentId) {
        return applicationService.getApplicationsByStudent(studentId);
    }
    
    // Admin/Coordinator/Company can view all applications for a specific job
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR', 'COMPANY')")
    @GetMapping("/job/{jobId}")
    public List<Application> getJobApplications(@PathVariable Long jobId) {
        return applicationService.getApplicationsByJob(jobId);
    }

    // Admin can view ALL applications across all jobs
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    @GetMapping
    public List<Application> getAllApplications() {
        return applicationService.getAllApplications();
    }

    // Students can apply for a job
    @PostMapping
    public ResponseEntity<?> apply(@RequestBody Application application) {
        try {
            Application saved = applicationService.applyForJob(application);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Admin/Coordinator can update application status (e.g., APPLIED → SHORTLISTED)
    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    @PatchMapping("/{id}/status")
    public ResponseEntity<Application> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            ApplicationStatus newStatus = ApplicationStatus.valueOf(body.get("status").toUpperCase());
            Application updated = applicationService.updateStatus(id, newStatus);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
