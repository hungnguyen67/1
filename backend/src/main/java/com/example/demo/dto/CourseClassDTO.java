package com.example.demo.dto;

import java.time.LocalDateTime;
import java.util.List;

public class CourseClassDTO {
    private Long id;
    private String classCode;
    private Long subjectId;
    private Long lecturerId;
    private String subjectName;
    private String subjectCode;
    private Integer credits;
    private String lecturerName;
    private Integer maxStudents;
    private Integer currentEnrolled;
    private String classStatus;
    private List<ScheduleDTO> schedules;

    public static class ScheduleDTO {
        private Integer dayOfWeek;
        private Integer startPeriod;
        private Integer endPeriod;
        private String roomName;
        private String sessionType;

        public ScheduleDTO() {}
        public ScheduleDTO(Integer dayOfWeek, Integer startPeriod, Integer endPeriod, String roomName, String sessionType) {
            this.dayOfWeek = dayOfWeek;
            this.startPeriod = startPeriod;
            this.endPeriod = endPeriod;
            this.roomName = roomName;
            this.sessionType = sessionType;
        }

        public Integer getDayOfWeek() { return dayOfWeek; }
        public void setDayOfWeek(Integer dayOfWeek) { this.dayOfWeek = dayOfWeek; }
        public Integer getStartPeriod() { return startPeriod; }
        public void setStartPeriod(Integer startPeriod) { this.startPeriod = startPeriod; }
        public Integer getEndPeriod() { return endPeriod; }
        public void setEndPeriod(Integer endPeriod) { this.endPeriod = endPeriod; }
        public String getRoomName() { return roomName; }
        public void setRoomName(String roomName) { this.roomName = roomName; }
        public String getSessionType() { return sessionType; }
        public void setSessionType(String sessionType) { this.sessionType = sessionType; }
    }

    public CourseClassDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getClassCode() { return classCode; }
    public void setClassCode(String classCode) { this.classCode = classCode; }
    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }
    public Long getLecturerId() { return lecturerId; }
    public void setLecturerId(Long lecturerId) { this.lecturerId = lecturerId; }
    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }
    public Integer getCredits() { return credits; }
    public void setCredits(Integer credits) { this.credits = credits; }
    public String getLecturerName() { return lecturerName; }
    public void setLecturerName(String lecturerName) { this.lecturerName = lecturerName; }
    public Integer getMaxStudents() { return maxStudents; }
    public void setMaxStudents(Integer maxStudents) { this.maxStudents = maxStudents; }
    public Integer getCurrentEnrolled() { return currentEnrolled; }
    public void setCurrentEnrolled(Integer currentEnrolled) { this.currentEnrolled = currentEnrolled; }
    public String getClassStatus() { return classStatus; }
    public void setClassStatus(String classStatus) { this.classStatus = classStatus; }
    public List<ScheduleDTO> getSchedules() { return schedules; }
    public void setSchedules(List<ScheduleDTO> schedules) { this.schedules = schedules; }
}
