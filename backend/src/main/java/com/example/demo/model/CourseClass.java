package com.example.demo.model;

import javax.persistence.*;

@Entity
@Table(name = "course_classes")
public class CourseClass {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @ManyToOne
    @JoinColumn(name = "lecturer_id", nullable = false)
    private User lecturer;

    @ManyToOne
    @JoinColumn(name = "semester_id", nullable = false)
    private Semester semester;

    @Column(name = "max_students")
    private Integer maxStudents;

    @Column(name = "current_enrolled")
    private Integer currentEnrolled;

    @Enumerated(EnumType.STRING)
    private CourseClassStatus status;

    public enum CourseClassStatus {
        PLANNING, OPEN, FULL, CANCELLED, FINISHED
    }

    public CourseClass() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Subject getSubject() { return subject; }
    public void setSubject(Subject subject) { this.subject = subject; }

    public User getLecturer() { return lecturer; }
    public void setLecturer(User lecturer) { this.lecturer = lecturer; }

    public Semester getSemester() { return semester; }
    public void setSemester(Semester semester) { this.semester = semester; }

    public Integer getMaxStudents() { return maxStudents; }
    public void setMaxStudents(Integer maxStudents) { this.maxStudents = maxStudents; }

    public Integer getCurrentEnrolled() { return currentEnrolled; }
    public void setCurrentEnrolled(Integer currentEnrolled) { this.currentEnrolled = currentEnrolled; }

    public CourseClassStatus getStatus() { return status; }
    public void setStatus(CourseClassStatus status) { this.status = status; }
}
