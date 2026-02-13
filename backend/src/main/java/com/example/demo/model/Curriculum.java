package com.example.demo.model;

import javax.persistence.*;

@Entity
@Table(name = "curriculums")
public class Curriculum {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "major_id", nullable = false)
    private Major major;

    @Column(name = "curriculum_name", nullable = false)
    private String curriculumName;

    @Column(name = "applied_year", nullable = false)
    private Integer appliedYear;

    @Column(name = "total_credits_required")
    private Integer totalCreditsRequired = 120;

    public Curriculum() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Major getMajor() { return major; }
    public void setMajor(Major major) { this.major = major; }

    public String getCurriculumName() { return curriculumName; }
    public void setCurriculumName(String curriculumName) { this.curriculumName = curriculumName; }

    public Integer getAppliedYear() { return appliedYear; }
    public void setAppliedYear(Integer appliedYear) { this.appliedYear = appliedYear; }

    public Integer getTotalCreditsRequired() { return totalCreditsRequired; }
    public void setTotalCreditsRequired(Integer totalCreditsRequired) { this.totalCreditsRequired = totalCreditsRequired; }
}
