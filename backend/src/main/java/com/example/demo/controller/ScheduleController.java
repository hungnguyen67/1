package com.example.demo.controller;

import com.example.demo.model.ClassScheduleInstance;
import com.example.demo.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@CrossOrigin(origins = "*")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @PostMapping("/patterns/{classId}")
    public ResponseEntity<Void> addPattern(@PathVariable Long classId, @RequestBody com.example.demo.model.ClassSchedulePattern pattern) {
        scheduleService.addPattern(classId, pattern);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/generate/{classId}")
    public ResponseEntity<Void> generateInstances(@PathVariable Long classId) {
        scheduleService.generateInstances(classId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<List<com.example.demo.dto.ClassScheduleInstanceDTO>> getScheduleByClass(@PathVariable Long classId) {
        return ResponseEntity.ok(scheduleService.getScheduleByClass(classId));
    }

    @GetMapping("/conflicts/{classId}")
    public ResponseEntity<List<ScheduleService.ConflictInfo>> checkConflicts(@PathVariable Long classId) {
        return ResponseEntity.ok(scheduleService.checkConflicts(classId));
    }
}
