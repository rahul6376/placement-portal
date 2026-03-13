package com.example.backend.service;

import com.example.backend.model.StudentProfile;
import com.example.backend.repository.StudentProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentProfileService {

    @Autowired
    private StudentProfileRepository profileRepository;

    public Optional<StudentProfile> getProfileByUserId(Long userId) {
        return profileRepository.findByUserId(userId);
    }

    public StudentProfile saveOrUpdateProfile(StudentProfile profile) {
        return profileRepository.save(profile);
    }

    public List<StudentProfile> getAllProfiles() {
        return profileRepository.findAll();
    }
}
