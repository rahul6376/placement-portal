package com.example.backend.controller;

import com.example.backend.model.Job;
import com.example.backend.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    @GetMapping
    public List<Job> getAllJobs(@RequestParam(required = false) String search) {
        if (search != null && !search.isEmpty()) {
            return jobService.searchJobs(search);
        }
        return jobService.getAllJobs();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    @PostMapping
    public ResponseEntity<Job> createJob(@RequestBody Job job) {
        Job createdJob = jobService.createJob(job);
        return ResponseEntity.ok(createdJob);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(@PathVariable Long id, @RequestBody Job job) {
        return ResponseEntity.ok(jobService.updateJob(id, job));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'COORDINATOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }
}
