package com.example.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class StudentsController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/students")
    @PreAuthorize("hasRole('ADMIN') or hasRole('LECTURER')")
    public ResponseEntity<?> getStudents() {
        try {
            List<User> students = userRepository.findAll().stream()
                    .filter(user -> user.getRole() != null && "STUDENT".equals(user.getRole().getName()))
                    .collect(Collectors.toList());

            List<Map<String, Object>> studentList = students.stream()
                    .map(user -> {
                        Map<String, Object> userMap = new HashMap<>();
                        userMap.put("id", user.getId());
                        userMap.put("email", user.getEmail());
                        userMap.put("name", user.getLastName() + " " + user.getFirstName());
                        userMap.put("role", user.getRole().getName());
                        userMap.put("enabled", user.getEnabled());
                        userMap.put("lastLogin", user.getLastLogin());
                        userMap.put("createdAt", user.getCreatedAt());
                        return userMap;
                    })
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("students", studentList);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Lỗi: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}