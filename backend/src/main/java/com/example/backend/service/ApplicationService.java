package com.example.backend.service;

import com.example.backend.model.Application;
import com.example.backend.model.ApplicationStatus;
import com.example.backend.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    public List<Application> getApplicationsByStudent(Long studentId) {
        return applicationRepository.findByStudentId(studentId);
    }
    
    public List<Application> getApplicationsByJob(Long jobId) {
        return applicationRepository.findByJobId(jobId);
    }

    public Application applyForJob(Application application) {
        // Prevent duplicate applications
        boolean alreadyApplied = applicationRepository
                .existsByStudentIdAndJobId(application.getStudent().getId(), application.getJob().getId());
        if (alreadyApplied) {
            throw new RuntimeException("You have already applied for this position.");
        }
        return applicationRepository.save(application);
    }

    public Application updateStatus(Long applicationId, ApplicationStatus newStatus) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found: " + applicationId));
        application.setStatus(newStatus);
        return applicationRepository.save(application);
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }
}
