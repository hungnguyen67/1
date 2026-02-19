package com.example.demo.service;

import com.example.demo.dto.AdministrativeClassDTO;
import com.example.demo.model.AdministrativeClass;
import com.example.demo.repository.AdministrativeClassRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdministrativeClassService {

    @Autowired
    private AdministrativeClassRepository administrativeClassRepository;

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
        return dto;
    }
}
