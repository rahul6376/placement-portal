package com.example.backend.controller;

import com.example.backend.model.StudentProfile;
import com.example.backend.service.StudentProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profiles")
public class StudentProfileController {

    @Autowired
    private StudentProfileService profileService;

    // Get a student's profile by their user ID
    @GetMapping("/{userId}")
    public ResponseEntity<StudentProfile> getProfile(@PathVariable Long userId) {
        return profileService.getProfileByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create or update a student profile
    @PostMapping
    public ResponseEntity<StudentProfile> updateProfile(@RequestBody StudentProfile profile) {
        StudentProfile saved = profileService.saveOrUpdateProfile(profile);
        return ResponseEntity.ok(saved);
    }

    // Get all student profiles (admin view)
    @GetMapping
    public List<StudentProfile> getAllProfiles() {
        return profileService.getAllProfiles();
    }
}
