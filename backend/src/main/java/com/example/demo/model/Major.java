package com.example.demo.model;

import javax.persistence.*;

@Entity
@Table(name = "majors")
public class Major {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "major_code", unique = true, nullable = false)
    private String majorCode;

    @Column(name = "major_name", nullable = false)
    private String majorName;

    @Column(name = "faculty_name", nullable = false)
    private String facultyName;

    @Column(columnDefinition = "TEXT")
    private String description;

    public Major() {}

    public Major(String majorCode, String majorName, String facultyName, String description) {
        this.majorCode = majorCode;
        this.majorName = majorName;
        this.facultyName = facultyName;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMajorCode() { return majorCode; }
    public void setMajorCode(String majorCode) { this.majorCode = majorCode; }

    public String getMajorName() { return majorName; }
    public void setMajorName(String majorName) { this.majorName = majorName; }

    public String getFacultyName() { return facultyName; }
    public void setFacultyName(String facultyName) { this.facultyName = facultyName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
