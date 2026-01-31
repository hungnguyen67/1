package com.example.demo.model;

import javax.persistence.*;

@Entity
@Table(name = "semesters")
public class Semester {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(name = "start_date")
    private java.time.LocalDate startDate;

    @Column(name = "end_date")
    private java.time.LocalDate endDate;

    @Column(name = "registration_open")
    private java.time.LocalDateTime registrationOpen;

    @Column(name = "registration_close")
    private java.time.LocalDateTime registrationClose;

    @Enumerated(EnumType.STRING)
    private SemesterStatus status;

    public enum SemesterStatus {
        UPCOMING, OPEN, ONGOING, CLOSED
    }

    public Semester() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public java.time.LocalDate getStartDate() { return startDate; }
    public void setStartDate(java.time.LocalDate startDate) { this.startDate = startDate; }

    public java.time.LocalDate getEndDate() { return endDate; }
    public void setEndDate(java.time.LocalDate endDate) { this.endDate = endDate; }

    public java.time.LocalDateTime getRegistrationOpen() { return registrationOpen; }
    public void setRegistrationOpen(java.time.LocalDateTime registrationOpen) { this.registrationOpen = registrationOpen; }

    public java.time.LocalDateTime getRegistrationClose() { return registrationClose; }
    public void setRegistrationClose(java.time.LocalDateTime registrationClose) { this.registrationClose = registrationClose; }

    public SemesterStatus getStatus() { return status; }
    public void setStatus(SemesterStatus status) { this.status = status; }
}
