package com.example.demo.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "course_enrollments")
public class CourseEnrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "course_class_id", nullable = false)
    private CourseClass courseClass;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Column(name = "enrollment_date")
    private LocalDateTime enrollmentDate;

    public CourseEnrollment() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public CourseClass getCourseClass() { return courseClass; }
    public void setCourseClass(CourseClass courseClass) { this.courseClass = courseClass; }

    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }

    public LocalDateTime getEnrollmentDate() { return enrollmentDate; }
    public void setEnrollmentDate(LocalDateTime enrollmentDate) { this.enrollmentDate = enrollmentDate; }
}
