package com.example.demo.dto;

public class SubjectDTO {
    private Long id;
    private String subjectCode;
    private String name;
    private Integer credits;
    private String description;

    public SubjectDTO() {}

    public SubjectDTO(Long id, String subjectCode, String name, Integer credits, String description) {
        this.id = id;
        this.subjectCode = subjectCode;
        this.name = name;
        this.credits = credits;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getCredits() { return credits; }
    public void setCredits(Integer credits) { this.credits = credits; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
