package com.example.backend.config;

import com.example.backend.model.Job;
import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.JobRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SeedDataConfig {

    @Bean
    public CommandLineRunner seedDatabase(UserRepository userRepository, JobRepository jobRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                User google = User.builder()
                        .name("Google")
                        .email("careers@google.com")
                        .password("hashed_password_here")
                        .role(Role.COMPANY)
                        .build();

                User amazon = User.builder()
                        .name("Amazon")
                        .email("jobs@amazon.com")
                        .password("hashed_password_here")
                        .role(Role.COMPANY)
                        .build();

                userRepository.save(google);
                userRepository.save(amazon);

                if (jobRepository.count() == 0) {
                    Job job1 = Job.builder()
                            .title("Software Engineer III")
                            .company(google)
                            .location("Bangalore, India")
                            .salary("₹ 40,00,000 - ₹ 60,00,000")
                            .description("Join our Core Search Team")
                            .requirements("Java, Spring Boot, Microservices")
                            .build();

                    Job job2 = Job.builder()
                            .title("SDE-1")
                            .company(amazon)
                            .location("Hyderabad, India")
                            .salary("₹ 25,00,000 - ₹ 35,00,000")
                            .description("AWS team looking for fresh talent")
                            .requirements("C++, Algorithms, Data Structures")
                            .build();

                    jobRepository.save(job1);
                    jobRepository.save(job2);
                }
            }
        };
    }
}
