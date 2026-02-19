package com.example.demo.dto;

public class StudentDTO {
    private Long id;
    private String studentCode;
    private String fullName;
    private String className;
    private Long classId;
    private String majorName;
    private Integer enrollmentYear;
    private Integer totalCreditsEarned;
    private Double currentGpa;
    private String academicStatus;

    public StudentDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStudentCode() { return studentCode; }
    public void setStudentCode(String studentCode) { this.studentCode = studentCode; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }

    public Long getClassId() { return classId; }
    public void setClassId(Long classId) { this.classId = classId; }

    public String getMajorName() { return majorName; }
    public void setMajorName(String majorName) { this.majorName = majorName; }

    public Integer getEnrollmentYear() { return enrollmentYear; }
    public void setEnrollmentYear(Integer enrollmentYear) { this.enrollmentYear = enrollmentYear; }

    public Integer getTotalCreditsEarned() { return totalCreditsEarned; }
    public void setTotalCreditsEarned(Integer totalCreditsEarned) { this.totalCreditsEarned = totalCreditsEarned; }

    public Double getCurrentGpa() { return currentGpa; }
    public void setCurrentGpa(Double currentGpa) { this.currentGpa = currentGpa; }

    public String getAcademicStatus() { return academicStatus; }
    public void setAcademicStatus(String academicStatus) { this.academicStatus = academicStatus; }
}
