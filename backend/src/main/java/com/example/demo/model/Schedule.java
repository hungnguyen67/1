package com.example.demo.model;

import javax.persistence.*;

@Entity
@Table(name = "schedules")
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "course_class_id", nullable = false)
    private CourseClass courseClass;

    @Column(name = "schedule_date", nullable = false)
    private java.time.LocalDate scheduleDate;

    @Column(name = "start_period", nullable = false)
    private Integer startPeriod;

    @Column(name = "end_period", nullable = false)
    private Integer endPeriod;

    @Column(name = "room_name", nullable = false)
    private String roomName;

    public Schedule() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public CourseClass getCourseClass() { return courseClass; }
    public void setCourseClass(CourseClass courseClass) { this.courseClass = courseClass; }

    public java.time.LocalDate getScheduleDate() { return scheduleDate; }
    public void setScheduleDate(java.time.LocalDate scheduleDate) { this.scheduleDate = scheduleDate; }

    public Integer getStartPeriod() { return startPeriod; }
    public void setStartPeriod(Integer startPeriod) { this.startPeriod = startPeriod; }

    public Integer getEndPeriod() { return endPeriod; }
    public void setEndPeriod(Integer endPeriod) { this.endPeriod = endPeriod; }

    public String getRoomName() { return roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }
}
