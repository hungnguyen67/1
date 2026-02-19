package com.example.demo.service;

import com.example.demo.dto.LecturerDTO;
import com.example.demo.model.LecturerProfile;
import com.example.demo.model.AdministrativeClass;
import com.example.demo.repository.LecturerProfileRepository;
import com.example.demo.repository.AdministrativeClassRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LecturerService {

    @Autowired
    private LecturerProfileRepository lecturerProfileRepository;

    @Autowired
    private AdministrativeClassRepository administrativeClassRepository;

    public List<LecturerDTO> getAllLecturers(String searchTerm, Long majorId) {
        List<LecturerProfile> lecturers = lecturerProfileRepository.searchLecturers(searchTerm, majorId);
        return lecturers.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private LecturerDTO convertToDTO(LecturerProfile lecturer) {
        LecturerDTO dto = new LecturerDTO();
        dto.setId(lecturer.getUserId());
        dto.setLecturerCode(lecturer.getLecturerCode());
        dto.setFullName(lecturer.getUser().getFullName());
        dto.setMajorId(lecturer.getMajor() != null ? lecturer.getMajor().getId() : null);
        dto.setMajorName(lecturer.getMajor() != null ? lecturer.getMajor().getMajorName() : null);
        dto.setDegree(lecturer.getDegree());
        dto.setAcademicRank(lecturer.getAcademicRank());
        dto.setPhone(lecturer.getUser().getPhone());
        dto.setGender(lecturer.getUser().getGender() != null ? lecturer.getUser().getGender().name() : null);
        
        List<AdministrativeClass> classes = administrativeClassRepository.findByAdvisorUserId(lecturer.getUserId());
        dto.setAdvisorClasses(classes.stream()
                .map(AdministrativeClass::getClassCode)
                .collect(Collectors.toList()));
        
        return dto;
    }
}
