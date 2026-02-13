package com.example.demo.service;

import com.example.demo.dto.MajorDTO;
import com.example.demo.model.Curriculum;
import com.example.demo.model.Major;
import com.example.demo.repository.CurriculumRepository;
import com.example.demo.repository.MajorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MajorService {

    @Autowired
    private MajorRepository majorRepository;

    @Autowired
    private CurriculumRepository curriculumRepository;

    @Autowired
    private com.example.demo.repository.CurriculumSubjectRepository curriculumSubjectRepository;

    @Autowired
    private com.example.demo.repository.KnowledgeBlockRepository knowledgeBlockRepository;

    public List<MajorDTO> getAllMajors() {
        return majorRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public MajorDTO getMajorById(Long id) {
        Major major = majorRepository.findById(id).orElseThrow(() -> new RuntimeException("Major not found"));
        return convertToDTO(major);
    }

    public MajorDTO createMajor(MajorDTO majorDTO) {
        Major major = new Major();
        major.setMajorCode(majorDTO.getMajorCode());
        major.setMajorName(majorDTO.getMajorName());
        major.setFacultyName(majorDTO.getFacultyName());
        major.setDescription(majorDTO.getDescription());
        Major savedMajor = majorRepository.save(major);
        return convertToDTO(savedMajor);
    }

    public MajorDTO updateMajor(Long id, MajorDTO majorDTO) {
        Major major = majorRepository.findById(id).orElseThrow(() -> new RuntimeException("Major not found"));
        major.setMajorCode(majorDTO.getMajorCode());
        major.setMajorName(majorDTO.getMajorName());
        major.setFacultyName(majorDTO.getFacultyName());
        major.setDescription(majorDTO.getDescription());
        Major savedMajor = majorRepository.save(major);
        return convertToDTO(savedMajor);
    }

    public void deleteMajor(Long id) {
        majorRepository.deleteById(id);
    }

    private MajorDTO convertToDTO(Major major) {
        List<Curriculum> curriculums = curriculumRepository.findByMajorId(major.getId());
        int numberOfCurriculums = curriculums.size();
        
        String status = numberOfCurriculums > 0 ? "Đang áp dụng" : "Ngừng áp dụng"; 
        
        int totalCredits = 0;
        String activeCurriculumName = "-";
        int totalSubjects = 0;

        if (!curriculums.isEmpty()) {
             // Find latest applied year for display name
             curriculums.sort((c1, c2) -> c2.getAppliedYear().compareTo(c1.getAppliedYear()));
             activeCurriculumName = curriculums.get(0).getCurriculumName();
             
             // Calculate total credits, subjects and blocks dynamically by aggregating ALL curriculums
             java.util.Set<Long> uniqueSubjectIds = new java.util.HashSet<>();
             java.util.Set<String> uniqueBlockNames = new java.util.HashSet<>();
             int totalKnowledgeBlocks = 0;
             
             for (Curriculum curriculum : curriculums) {
                 // Sum unique subjects/credits
                 List<com.example.demo.model.CurriculumSubject> curriculumSubjects = curriculumSubjectRepository.findByCurriculumId(curriculum.getId());
                 for (com.example.demo.model.CurriculumSubject cs : curriculumSubjects) {
                     if (cs.getSubject() != null && !uniqueSubjectIds.contains(cs.getSubject().getId())) {
                         uniqueSubjectIds.add(cs.getSubject().getId());
                         totalCredits += cs.getSubject().getCredits();
                     }
                 }
                 // Count blocks for this major (unique across curriculums if generic, or just sum?)
                 // Usually blocks have names like "Đại cương", "Cơ sở ngành".
                 List<com.example.demo.model.KnowledgeBlock> blocks = knowledgeBlockRepository.findByCurriculumId(curriculum.getId());
                 if (blocks != null) {
                    for (com.example.demo.model.KnowledgeBlock b : blocks) {
                        uniqueBlockNames.add(b.getBlockName());
                    }
                 }
             }
             totalSubjects = uniqueSubjectIds.size();
             totalKnowledgeBlocks = uniqueBlockNames.size();
             
             return new MajorDTO(
                major.getId(),
                major.getMajorCode(),
                major.getMajorName(),
                major.getFacultyName(),
                major.getDescription(),
                numberOfCurriculums,
                totalCredits,
                status,
                activeCurriculumName,
                totalSubjects,
                totalKnowledgeBlocks
             );
        }

        return new MajorDTO(
                major.getId(),
                major.getMajorCode(),
                major.getMajorName(),
                major.getFacultyName(),
                major.getDescription(),
                numberOfCurriculums,
                totalCredits,
                status,
                activeCurriculumName,
                totalSubjects,
                0 // totalKnowledgeBlocks
        );
    }
}
