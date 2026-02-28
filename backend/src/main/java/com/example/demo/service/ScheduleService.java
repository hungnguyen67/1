package com.example.demo.service;

import com.example.demo.model.*;
import com.example.demo.repository.ClassScheduleInstanceRepository;
import com.example.demo.repository.CourseClassRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScheduleService {

    @Autowired
    private ClassScheduleInstanceRepository instanceRepository;

    @Autowired
    private CourseClassRepository courseClassRepository;

    @Autowired
    private javax.persistence.EntityManager entityManager;

    @Transactional
    public void addPattern(Long classId, ClassSchedulePattern pattern) {
        CourseClass cc = courseClassRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Course class not found"));
        pattern.setCourseClass(cc);
        if (cc.getSchedules() == null) {
            cc.setSchedules(new ArrayList<>());
        }
        cc.getSchedules().add(pattern);
        courseClassRepository.save(cc);
    }

    @Transactional
    public void generateInstances(Long classId) {
        CourseClass cc = courseClassRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Course class not found"));
        
        Semester semester = cc.getSemester();
        if (semester == null || semester.getStartDate() == null || semester.getEndDate() == null) {
            throw new RuntimeException("Semester dates not fully defined");
        }

        List<ClassScheduleInstance> existing = instanceRepository.findByCourseClassId(classId);
        instanceRepository.deleteAll(existing);

        List<ClassSchedulePattern> patterns = cc.getSchedules();
        if (patterns == null || patterns.isEmpty()) return;

        List<ClassScheduleInstance> newInstances = new ArrayList<>();

        for (ClassSchedulePattern pattern : patterns) {
            LocalDate current = semester.getStartDate();
            LocalDate end = semester.getEndDate();

            int targetDay = pattern.getDayOfWeek(); 
            
            while (!current.isAfter(end)) {
                int normalizedDay = current.getDayOfWeek().getValue() + 1; 
                if (normalizedDay == targetDay) {
                    long weeksBetween = ChronoUnit.WEEKS.between(semester.getStartDate(), current) + 1;
                    
                    if (weeksBetween >= pattern.getFromWeek() && weeksBetween <= pattern.getToWeek()) {
                        ClassScheduleInstance inst = new ClassScheduleInstance();
                        inst.setCourseClass(cc);
                        inst.setScheduleDate(current);
                        inst.setStartPeriod(pattern.getStartPeriod());
                        inst.setEndPeriod(pattern.getEndPeriod());
                        inst.setStartTime(pattern.getStartTime());
                        inst.setEndTime(pattern.getEndTime());
                        inst.setRoomName(pattern.getRoomName());
                        inst.setLecturer(pattern.getLecturer() != null ? pattern.getLecturer() : cc.getLecturer());
                        inst.setType(pattern.getSessionType());
                        inst.setStatus("PLANNED");
                        newInstances.add(inst);
                    }
                }
                current = current.plusDays(1);
            }
        }
        instanceRepository.saveAll(newInstances);
    }

    public List<com.example.demo.dto.ClassScheduleInstanceDTO> getScheduleByClass(Long classId) {
        List<ClassScheduleInstance> instances = instanceRepository.findByCourseClassId(classId);
        return instances.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private com.example.demo.dto.ClassScheduleInstanceDTO convertToDTO(ClassScheduleInstance inst) {
        com.example.demo.dto.ClassScheduleInstanceDTO dto = new com.example.demo.dto.ClassScheduleInstanceDTO();
        dto.setId(inst.getId());
        dto.setScheduleDate(inst.getScheduleDate());
        dto.setStartTime(inst.getStartTime());
        dto.setEndTime(inst.getEndTime());
        dto.setStartPeriod(inst.getStartPeriod());
        dto.setEndPeriod(inst.getEndPeriod());
        dto.setRoomName(inst.getRoomName());
        dto.setType(inst.getType());
        dto.setStatus(inst.getStatus());
        
        if (inst.getCourseClass() != null) {
            dto.setClassId(inst.getCourseClass().getId());
            dto.setClassCode(inst.getCourseClass().getClassCode());
            if (inst.getCourseClass().getSubject() != null) {
                dto.setSubjectName(inst.getCourseClass().getSubject().getName());
            }
        }
        
        if (inst.getLecturer() != null && inst.getLecturer().getUser() != null) {
            dto.setLecturerName(inst.getLecturer().getUser().getFullName());
        } else if (inst.getCourseClass() != null && inst.getCourseClass().getLecturer() != null 
                   && inst.getCourseClass().getLecturer().getUser() != null) {
            dto.setLecturerName(inst.getCourseClass().getLecturer().getUser().getFullName());
        }
        
        return dto;
    }

    public List<ConflictInfo> checkConflicts(Long classId) {
        List<ClassScheduleInstance> classInstances = instanceRepository.findByCourseClassId(classId);
        List<ConflictInfo> conflicts = new ArrayList<>();

        for (ClassScheduleInstance inst : classInstances) {
            if (inst.getRoomName() != null && !inst.getRoomName().isEmpty()) {
                List<ClassScheduleInstance> roomOccurrences = instanceRepository.findByRoomNameAndScheduleDate(
                        inst.getRoomName(), inst.getScheduleDate());
                
                for (ClassScheduleInstance other : roomOccurrences) {
                    if (!other.getCourseClass().getId().equals(classId) && timeOverlaps(inst, other)) {
                        conflicts.add(new ConflictInfo("ROOM", 
                            String.format("Phòng %s bị trùng vào ngày %s (%s-%s) với lớp %s", 
                                inst.getRoomName(), inst.getScheduleDate(), inst.getStartPeriod(), 
                                inst.getEndPeriod(), other.getCourseClass().getClassCode())));
                    }
                }
            }

            if (inst.getLecturer() != null) {
                List<ClassScheduleInstance> lecturerOccurrences = instanceRepository.findByLecturerUserIdAndScheduleDate(
                        inst.getLecturer().getUserId(), inst.getScheduleDate());
                
                for (ClassScheduleInstance other : lecturerOccurrences) {
                    if (!other.getCourseClass().getId().equals(classId) && timeOverlaps(inst, other)) {
                        conflicts.add(new ConflictInfo("LECTURER", 
                            String.format("Giảng viên %s bị trùng lịch vào ngày %s (%s-%s) với lớp %s", 
                                inst.getLecturer().getUser().getFullName(), inst.getScheduleDate(), 
                                inst.getStartPeriod(), inst.getEndPeriod(), other.getCourseClass().getClassCode())));
                    }
                }
            }
        }
        return conflicts.stream().distinct().collect(Collectors.toList());
    }

    private boolean timeOverlaps(ClassScheduleInstance i1, ClassScheduleInstance i2) {
        return Math.max(i1.getStartPeriod(), i2.getStartPeriod()) <= Math.min(i1.getEndPeriod(), i2.getEndPeriod());
    }

    public static class ConflictInfo {
        private String type;
        private String content;

        public ConflictInfo(String type, String content) {
            this.type = type;
            this.content = content;
        }

        public String getType() { return type; }
        public String getContent() { return content; }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            ConflictInfo that = (ConflictInfo) o;
            return type.equals(that.type) && content.equals(that.content);
        }

        @Override
        public int hashCode() {
            int result = type.hashCode();
            result = 31 * result + content.hashCode();
            return result;
        }
    }
}
