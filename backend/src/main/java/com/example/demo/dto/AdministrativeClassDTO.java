package com.example.demo.dto;

public class AdministrativeClassDTO {
    private Long id;
    private String classCode;
    private String className;
    private Long majorId;
    private String majorCode;
    private String majorName;
    private String academicYear;
    private Integer cohort;
    private Long advisorId;
    private String advisorName;
    private String status;
    private Long studentCount;
    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime updatedAt;

    public AdministrativeClassDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getClassCode() { return classCode; }
    public void setClassCode(String classCode) { this.classCode = classCode; }

    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }

    public Long getMajorId() { return majorId; }
    public void setMajorId(Long majorId) { this.majorId = majorId; }

    public String getMajorName() { return majorName; }
    public void setMajorName(String majorName) { this.majorName = majorName; }

    public String getMajorCode() { return majorCode; }
    public void setMajorCode(String majorCode) { this.majorCode = majorCode; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }

    public Integer getCohort() { return cohort; }
    public void setCohort(Integer cohort) { this.cohort = cohort; }

    public Long getAdvisorId() { return advisorId; }
    public void setAdvisorId(Long advisorId) { this.advisorId = advisorId; }

    public String getAdvisorName() { return advisorName; }
    public void setAdvisorName(String advisorName) { this.advisorName = advisorName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getStudentCount() { return studentCount; }
    public void setStudentCount(Long studentCount) { this.studentCount = studentCount; }

    public java.time.LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(java.time.LocalDateTime createdAt) { this.createdAt = createdAt; }

    public java.time.LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(java.time.LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
