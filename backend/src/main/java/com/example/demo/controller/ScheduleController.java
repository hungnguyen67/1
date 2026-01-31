package com.example.demo.controller;

import com.example.demo.model.Schedule;
import com.example.demo.model.User;
import com.example.demo.repository.ScheduleRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedule")
public class ScheduleController {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/my")
    public ResponseEntity<?> getMySchedule(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).build();
        
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return ResponseEntity.status(404).body("User not found");

        List<Schedule> schedules;
        String role = user.getRole() != null ? user.getRole().getName() : "";
        
        if ("ADMIN".equals(role)) {
            schedules = scheduleRepository.findAll();
        } else if ("LECTURER".equals(role)) {
            schedules = scheduleRepository.findByLecturerId(user.getId());
        } else {
            schedules = scheduleRepository.findByStudentId(user.getId());
        }

        return ResponseEntity.ok(schedules);
    }
}
