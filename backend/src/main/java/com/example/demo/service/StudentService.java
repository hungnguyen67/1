package com.example.demo.service;

import com.example.demo.dto.StudentDTO;
import com.example.demo.model.StudentProfile;
import com.example.demo.repository.StudentProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    public List<StudentDTO> searchStudents(String searchTerm, Long classId, Long majorId, 
                                          Integer enrollmentYear, String status, Double minGpa, Double maxGpa) {
        
        StudentProfile.AcademicStatus academicStatus = null;
        if (status != null && !status.isEmpty()) {
            try {
                academicStatus = StudentProfile.AcademicStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Ignore invalid status
            }
        }

        List<StudentProfile> students = studentProfileRepository.searchStudents(
                searchTerm, classId, majorId, enrollmentYear, academicStatus, minGpa, maxGpa);
                
        return students.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private StudentDTO convertToDTO(StudentProfile student) {
        StudentDTO dto = new StudentDTO();
        dto.setId(student.getUserId());
        dto.setStudentCode(student.getStudentCode());
        dto.setFullName(student.getUser().getFullName());
        
        if (student.getAdministrativeClass() != null) {
            dto.setClassName(student.getAdministrativeClass().getClassCode());
            dto.setClassId(student.getAdministrativeClass().getId());
            if (student.getAdministrativeClass().getMajor() != null) {
                dto.setMajorName(student.getAdministrativeClass().getMajor().getMajorName());
            }
        }
        
        dto.setEnrollmentYear(student.getEnrollmentYear());
        dto.setTotalCreditsEarned(student.getTotalCreditsEarned());
        dto.setCurrentGpa(student.getCurrentGpa());
        dto.setAcademicStatus(student.getAcademicStatus() != null ? student.getAcademicStatus().name() : null);
        
        return dto;
    }
}
