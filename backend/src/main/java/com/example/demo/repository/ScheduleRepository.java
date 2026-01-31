package com.example.demo.repository;

import com.example.demo.model.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    @Query("SELECT s FROM Schedule s JOIN s.courseClass cc JOIN CourseEnrollment ce ON ce.courseClass = cc WHERE ce.student.id = :studentId")
    List<Schedule> findByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT s FROM Schedule s WHERE s.courseClass.lecturer.id = :lecturerId")
    List<Schedule> findByLecturerId(@Param("lecturerId") Long lecturerId);
}
