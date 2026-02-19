package com.example.demo.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import javax.persistence.*;

@Entity
@Table(name = "student_profiles")
public class StudentProfile implements Serializable {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "student_code", unique = true, nullable = false)
    private String studentCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curriculum_id", nullable = false)
    private Curriculum curriculum;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    private AdministrativeClass administrativeClass;

    @Column(name = "enrollment_year", nullable = false)
    private Integer enrollmentYear;

    @Column(name = "total_credits_earned")
    private Integer totalCreditsEarned = 0;

    @Column(name = "current_gpa")
    private Double currentGpa;

    @Enumerated(EnumType.STRING)
    @Column(name = "academic_status")
    private AcademicStatus academicStatus = AcademicStatus.STUDYING;

    @Column(name = "gpa_updated_at")
    private LocalDateTime gpaUpdatedAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum AcademicStatus {
        STUDYING, RESERVED, DROPPED, GRADUATED, SUSPENDED
    }

    public StudentProfile() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getStudentCode() { return studentCode; }
    public void setStudentCode(String studentCode) { this.studentCode = studentCode; }

    public Curriculum getCurriculum() { return curriculum; }
    public void setCurriculum(Curriculum curriculum) { this.curriculum = curriculum; }

    public AdministrativeClass getAdministrativeClass() { return administrativeClass; }
    public void setAdministrativeClass(AdministrativeClass administrativeClass) { this.administrativeClass = administrativeClass; }

    public Integer getEnrollmentYear() { return enrollmentYear; }
    public void setEnrollmentYear(Integer enrollmentYear) { this.enrollmentYear = enrollmentYear; }

    public Integer getTotalCreditsEarned() { return totalCreditsEarned; }
    public void setTotalCreditsEarned(Integer totalCreditsEarned) { this.totalCreditsEarned = totalCreditsEarned; }

    public Double getCurrentGpa() { return currentGpa; }
    public void setCurrentGpa(Double currentGpa) { this.currentGpa = currentGpa; }

    public AcademicStatus getAcademicStatus() { return academicStatus; }
    public void setAcademicStatus(AcademicStatus academicStatus) { this.academicStatus = academicStatus; }

    public LocalDateTime getGpaUpdatedAt() { return gpaUpdatedAt; }
    public void setGpaUpdatedAt(LocalDateTime gpaUpdatedAt) { this.gpaUpdatedAt = gpaUpdatedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
