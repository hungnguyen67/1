package com.example.demo.repository;

import com.example.demo.model.CourseClass;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseClassRepository extends JpaRepository<CourseClass, Long> {
}
