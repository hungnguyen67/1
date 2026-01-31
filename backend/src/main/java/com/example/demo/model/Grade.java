package com.example.demo.model;

import javax.persistence.*;

@Entity
@Table(name = "grades")
public class Grade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "course_class_id")
    private CourseClass courseClass;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    @Column(name = "attendance_score")
    private Double attendanceScore;

    @Column(name = "midterm_score")
    private Double midtermScore;

    @Column(name = "final_score")
    private Double finalScore;

    public Grade() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public CourseClass getCourseClass() { return courseClass; }
    public void setCourseClass(CourseClass courseClass) { this.courseClass = courseClass; }

    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }

    public Double getAttendanceScore() { return attendanceScore; }
    public void setAttendanceScore(Double attendanceScore) { this.attendanceScore = attendanceScore; }

    public Double getMidtermScore() { return midtermScore; }
    public void setMidtermScore(Double midtermScore) { this.midtermScore = midtermScore; }

    public Double getFinalScore() { return finalScore; }
    public void setFinalScore(Double finalScore) { this.finalScore = finalScore; }
}
