package com.example.demo.service;

import com.example.demo.dto.AdministrativeClassDTO;
import com.example.demo.model.AdministrativeClass;
import com.example.demo.repository.AdministrativeClassRepository;
import com.example.demo.repository.StudentProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdministrativeClassService {

    @Autowired
    private AdministrativeClassRepository administrativeClassRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    public List<AdministrativeClassDTO> getAllClasses() {
        return administrativeClassRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private AdministrativeClassDTO convertToDTO(AdministrativeClass clazz) {
        AdministrativeClassDTO dto = new AdministrativeClassDTO();
        dto.setId(clazz.getId());
        dto.setClassCode(clazz.getClassCode());
        dto.setMajorId(clazz.getMajor().getId());
        dto.setMajorName(clazz.getMajor().getMajorName());
        dto.setAcademicYear(clazz.getAcademicYear());
        
        if (clazz.getAdvisor() != null) {
            dto.setAdvisorId(clazz.getAdvisor().getUserId());
            dto.setAdvisorName(clazz.getAdvisor().getUser().getFirstName() + " " + clazz.getAdvisor().getUser().getLastName());
        }
        
        dto.setStatus(clazz.getStatus() != null ? clazz.getStatus().name() : "ACTIVE");
        dto.setStudentCount(studentProfileRepository.countByAdministrativeClassId(clazz.getId()));
        
        return dto;
    }
}
