package com.example.demo.dto;

import java.util.List;

public class LecturerDTO {
    private Long id;
    private String lecturerCode;
    private String fullName;
    private String majorName;
    private Long majorId;
    private String degree;
    private String academicRank;
    private String phone;
    private String gender;
    private List<String> advisorClasses;

    public LecturerDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLecturerCode() { return lecturerCode; }
    public void setLecturerCode(String lecturerCode) { this.lecturerCode = lecturerCode; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getMajorName() { return majorName; }
    public void setMajorName(String majorName) { this.majorName = majorName; }

    public Long getMajorId() { return majorId; }
    public void setMajorId(Long majorId) { this.majorId = majorId; }

    public String getDegree() { return degree; }
    public void setDegree(String degree) { this.degree = degree; }

    public String getAcademicRank() { return academicRank; }
    public void setAcademicRank(String academicRank) { this.academicRank = academicRank; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public List<String> getAdvisorClasses() { return advisorClasses; }
    public void setAdvisorClasses(List<String> advisorClasses) { this.advisorClasses = advisorClasses; }
}
