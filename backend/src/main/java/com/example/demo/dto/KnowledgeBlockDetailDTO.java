package com.example.demo.dto;

import java.util.List;

public class KnowledgeBlockDetailDTO {
    private Long blockId;
    private String blockName;
    private Integer creditsRequired;
    private List<CurriculumSubjectComponentDTO> subjects;

    public KnowledgeBlockDetailDTO() {}

    public KnowledgeBlockDetailDTO(Long blockId, String blockName, Integer creditsRequired, List<CurriculumSubjectComponentDTO> subjects) {
        this.blockId = blockId;
        this.blockName = blockName;
        this.creditsRequired = creditsRequired;
        this.subjects = subjects;
    }

    // Getters and Setters
    public Long getBlockId() { return blockId; }
    public void setBlockId(Long blockId) { this.blockId = blockId; }

    public String getBlockName() { return blockName; }
    public void setBlockName(String blockName) { this.blockName = blockName; }

    public Integer getCreditsRequired() { return creditsRequired; }
    public void setCreditsRequired(Integer creditsRequired) { this.creditsRequired = creditsRequired; }

    public List<CurriculumSubjectComponentDTO> getSubjects() { return subjects; }
    public void setSubjects(List<CurriculumSubjectComponentDTO> subjects) { this.subjects = subjects; }
}
