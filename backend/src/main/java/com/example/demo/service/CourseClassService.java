package com.example.demo.service;

import com.example.demo.dto.CourseClassDTO;
import com.example.demo.dto.CourseSubjectGroupDTO;
import com.example.demo.model.CourseClass;
import com.example.demo.model.Subject;
import com.example.demo.model.ClassSchedulePattern;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CourseClassService {

    @Autowired
    private CourseClassRepository courseClassRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private SemesterRepository semesterRepository;

    @Autowired
    private LecturerProfileRepository lecturerProfileRepository;

    public List<CourseSubjectGroupDTO> getGroupedSubjectsBySemester(Long semesterId) {
        List<CourseClass> classes = courseClassRepository.findBySemesterId(semesterId);
        
        // Group classes by subject
        Map<Subject, List<CourseClass>> grouped = classes.stream()
                .collect(Collectors.groupingBy(CourseClass::getSubject));
        
        return grouped.entrySet().stream()
                .map(entry -> {
                    Subject s = entry.getKey();
                    List<CourseClass> subjectClasses = entry.getValue();
                    return new CourseSubjectGroupDTO(
                            s.getId(),
                            s.getSubjectCode(),
                            s.getName(),
                            s.getCredits(),
                            subjectClasses.size(),
                            "ACTIVE"
                    );
                })
                .collect(Collectors.toList());
    }

    public List<CourseClassDTO> getClassesBySubjectAndSemester(Long semesterId, Long subjectId) {
        List<CourseClass> classes = courseClassRepository.findBySemesterIdAndSubjectId(semesterId, subjectId);
        return classes.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<CourseClassDTO> getClassesBySemester(Long semesterId) {
        List<CourseClass> classes = courseClassRepository.findBySemesterId(semesterId);
        return classes.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public CourseClassDTO createCourseClass(Long semesterId, CourseClassDTO dto) {
        CourseClass cc = new CourseClass();
        updateEntityFromDTO(cc, dto, semesterId);
        CourseClass saved = courseClassRepository.save(cc);
        return convertToDTO(saved);
    }

    public CourseClassDTO updateCourseClass(Long id, CourseClassDTO dto) {
        CourseClass cc = courseClassRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course class not found"));
        updateEntityFromDTO(cc, dto, cc.getSemester().getId());
        CourseClass updated = courseClassRepository.save(cc);
        return convertToDTO(updated);
    }

    public void deleteCourseClass(Long id) {
        courseClassRepository.deleteById(id);
    }

    private void updateEntityFromDTO(CourseClass cc, CourseClassDTO dto, Long semesterId) {
        cc.setClassCode(dto.getClassCode());
        cc.setSubject(subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found")));
        cc.setLecturer(lecturerProfileRepository.findById(dto.getLecturerId())
                .orElseThrow(() -> new RuntimeException("Lecturer not found")));
        cc.setSemester(semesterRepository.findById(semesterId)
                .orElseThrow(() -> new RuntimeException("Semester not found")));
        cc.setMaxStudents(dto.getMaxStudents());
        cc.setCurrentEnrolled(dto.getCurrentEnrolled());
        cc.setAllowRegister(dto.getCurrentEnrolled() < dto.getMaxStudents());
        cc.setClassStatus(CourseClass.ClassStatus.valueOf(dto.getClassStatus()));
        
        if (cc.getSchedules() != null) {
            cc.getSchedules().clear();
        } else {
            cc.setSchedules(new ArrayList<>());
        }
        
        if (dto.getSchedules() != null) {
            for (CourseClassDTO.ScheduleDTO sDto : dto.getSchedules()) {
                ClassSchedulePattern s = new ClassSchedulePattern();
                s.setCourseClass(cc);
                s.setDayOfWeek(sDto.getDayOfWeek());
                s.setStartPeriod(sDto.getStartPeriod());
                s.setEndPeriod(sDto.getEndPeriod());
                s.setRoomName(sDto.getRoomName());
                s.setSessionType(sDto.getSessionType());
                s.setFromWeek(1);
                s.setToWeek(15);
                cc.getSchedules().add(s);
            }
        }
    }

    private CourseClassDTO convertToDTO(CourseClass cc) {
        CourseClassDTO dto = new CourseClassDTO();
        dto.setId(cc.getId());
        dto.setClassCode(cc.getClassCode());
        dto.setSubjectId(cc.getSubject().getId());
        dto.setLecturerId(cc.getLecturer().getUserId());
        dto.setSubjectName(cc.getSubject().getName());
        dto.setSubjectCode(cc.getSubject().getSubjectCode());
        dto.setCredits(cc.getSubject().getCredits());
        dto.setLecturerName(cc.getLecturer().getUser().getFirstName() + " " + cc.getLecturer().getUser().getLastName());
        dto.setMaxStudents(cc.getMaxStudents());
        dto.setCurrentEnrolled(cc.getCurrentEnrolled());
        dto.setClassStatus(cc.getClassStatus().name());
        
        if (cc.getSchedules() != null) {
            dto.setSchedules(cc.getSchedules().stream()
                .map(s -> new CourseClassDTO.ScheduleDTO(
                        s.getDayOfWeek(),
                        s.getStartPeriod(),
                        s.getEndPeriod(),
                        s.getRoomName(),
                        s.getSessionType()
                )).collect(Collectors.toList()));
        }
        
        return dto;
    }
}
