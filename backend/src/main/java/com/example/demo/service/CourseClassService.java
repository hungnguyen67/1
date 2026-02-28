package com.example.demo.service;

import com.example.demo.dto.CourseClassDTO;
import com.example.demo.dto.CourseSubjectGroupDTO;
import com.example.demo.model.CourseClass;
import com.example.demo.model.Subject;
import com.example.demo.model.ClassSchedulePattern;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CourseClassService {

    @Autowired
    private CourseClassRepository courseClassRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private SemesterRepository semesterRepository;

    @Autowired
    private LecturerProfileRepository lecturerProfileRepository;

    @Autowired
    private CurriculumSubjectRepository curriculumSubjectRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private CourseRegistrationRepository registrationRepository;

    public List<CourseSubjectGroupDTO> getGroupedSubjectsBySemester(Long semesterId) {
        List<CourseClass> classes = courseClassRepository.findBySemesterId(semesterId);
        
        Map<Subject, List<CourseClass>> grouped = classes.stream()
                .collect(Collectors.groupingBy(CourseClass::getSubject));
        
        return grouped.entrySet().stream()
                .map(entry -> {
                    Subject s = entry.getKey();
                    List<CourseClass> subjectClasses = entry.getValue();
                    return new CourseSubjectGroupDTO(
                            s.getId(),
                            s.getSubjectCode(),
                            s.getName(),
                            s.getCredits(),
                            subjectClasses.size(),
                            "ACTIVE"
                    );
                })
                .collect(Collectors.toList());
    }

    public List<CourseClassDTO> getClassesBySubjectAndSemester(Long semesterId, Long subjectId) {
        List<CourseClass> classes = courseClassRepository.findBySemesterIdAndSubjectId(semesterId, subjectId);
        return classes.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<CourseClassDTO> getClassesBySemester(Long semesterId) {
        List<CourseClass> classes = courseClassRepository.findBySemesterId(semesterId);
        return classes.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public CourseClassDTO createCourseClass(Long semesterId, CourseClassDTO dto) {
        CourseClass cc = new CourseClass();
        updateEntityFromDTO(cc, dto, semesterId);
        CourseClass saved = courseClassRepository.save(cc);
        return convertToDTO(saved);
    }

    public CourseClassDTO updateCourseClass(Long id, CourseClassDTO dto) {
        CourseClass cc = courseClassRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course class not found"));
        updateEntityFromDTO(cc, dto, cc.getSemester().getId());
        CourseClass updated = courseClassRepository.save(cc);
        return convertToDTO(updated);
    }

    public void deleteCourseClass(Long id) {
        courseClassRepository.deleteById(id);
    }

    public List<CourseClassDTO> createBatch(Long semesterId, List<CourseClassDTO> dtos) {
        List<CourseClassDTO> results = new java.util.ArrayList<>();
        for (CourseClassDTO dto : dtos) {
            results.add(createCourseClass(semesterId, dto));
        }
        return results;
    }

    private void updateEntityFromDTO(CourseClass cc, CourseClassDTO dto, Long semesterId) {
        cc.setClassCode(dto.getClassCode());
        cc.setSubject(subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found")));
        cc.setLecturer(lecturerProfileRepository.findById(dto.getLecturerId())
                .orElseThrow(() -> new RuntimeException("Lecturer not found")));
        cc.setSemester(semesterRepository.findById(semesterId)
                .orElseThrow(() -> new RuntimeException("Semester not found")));
        cc.setMaxStudents(dto.getMaxStudents());
        cc.setCurrentEnrolled(dto.getCurrentEnrolled());
        cc.setAllowRegister(dto.getCurrentEnrolled() < dto.getMaxStudents());
        cc.setClassStatus(CourseClass.ClassStatus.valueOf(dto.getClassStatus()));
        cc.setRegistrationStart(dto.getRegistrationStart());
        cc.setRegistrationEnd(dto.getRegistrationEnd());
        cc.setAttendanceWeight(dto.getAttendanceWeight() != null ? dto.getAttendanceWeight() : 0.10);
        cc.setMidtermWeight(dto.getMidtermWeight() != null ? dto.getMidtermWeight() : 0.30);
        cc.setFinalWeight(dto.getFinalWeight() != null ? dto.getFinalWeight() : 0.60);
        
        if (cc.getSchedules() != null) {
            cc.getSchedules().clear();
        } else {
            cc.setSchedules(new ArrayList<>());
        }
        
        if (dto.getSchedules() != null) {
            for (CourseClassDTO.ScheduleDTO sDto : dto.getSchedules()) {
                ClassSchedulePattern s = new ClassSchedulePattern();
                s.setCourseClass(cc);
                s.setDayOfWeek(sDto.getDayOfWeek());
                s.setStartPeriod(sDto.getStartPeriod());
                s.setEndPeriod(sDto.getEndPeriod());
                s.setRoomName(sDto.getRoomName());
                s.setSessionType(sDto.getSessionType());
                s.setFromWeek(1);
                s.setToWeek(15);
                cc.getSchedules().add(s);
            }
        }
    }

    private CourseClassDTO convertToDTO(CourseClass cc) {
        CourseClassDTO dto = new CourseClassDTO();
        dto.setId(cc.getId());
        dto.setClassCode(cc.getClassCode());
        dto.setSubjectId(cc.getSubject().getId());
        dto.setLecturerId(cc.getLecturer().getUserId());
        dto.setSubjectName(cc.getSubject().getName());
        dto.setSubjectCode(cc.getSubject().getSubjectCode());
        dto.setCredits(cc.getSubject().getCredits());
        dto.setLecturerName(cc.getLecturer().getUser().getFirstName() + " " + cc.getLecturer().getUser().getLastName());
        dto.setMaxStudents(cc.getMaxStudents());
        dto.setCurrentEnrolled(cc.getCurrentEnrolled());
        dto.setClassStatus(cc.getClassStatus().name());
        dto.setRegistrationStart(cc.getRegistrationStart());
        dto.setRegistrationEnd(cc.getRegistrationEnd());
        dto.setAttendanceWeight(cc.getAttendanceWeight());
        dto.setMidtermWeight(cc.getMidtermWeight());
        dto.setFinalWeight(cc.getFinalWeight());
        
        if (cc.getSchedules() != null) {
            dto.setSchedules(cc.getSchedules().stream()
                .map(s -> new CourseClassDTO.ScheduleDTO(
                        s.getDayOfWeek(),
                        s.getStartPeriod(),
                        s.getEndPeriod(),
                        s.getRoomName(),
                        s.getSessionType()
                )).collect(Collectors.toList()));
        }
        
        return dto;
    }

    public List<com.example.demo.dto.CourseClassDemandAnalysisDTO> analyzeDemand(Long semesterId, Integer filterCohort, Long majorId, Long curriculumId) {
        com.example.demo.model.Semester academicSemester = semesterRepository.findById(semesterId)
                .orElseThrow(() -> new RuntimeException("Semester not found"));

        int acadStartYear;
        try {
            acadStartYear = Integer.parseInt(academicSemester.getAcademicYear().split("-")[0]);
        } catch (Exception e) {
            acadStartYear = academicSemester.getStartDate().getYear();
        }
        int semesterOrder = academicSemester.getSemesterOrder();

        List<com.example.demo.model.CurriculumSubject> allCurriculumSubjects = curriculumSubjectRepository.findAll();
        List<com.example.demo.model.StudentProfile> allStudents = studentProfileRepository.findAll();
        Map<Long, com.example.demo.dto.CourseClassDemandAnalysisDTO> analysisMap = new java.util.HashMap<>();
        Map<Integer, Map<Long, Long>> studentsByCohortAndCurr = allStudents.stream()
            .filter(s -> s.getAcademicStatus() == com.example.demo.model.StudentProfile.AcademicStatus.STUDYING)
            .filter(s -> filterCohort == null || s.getEnrollmentYear().equals(filterCohort))
            .filter(s -> curriculumId == null || (s.getCurriculum() != null && s.getCurriculum().getId().equals(curriculumId)))
            .filter(s -> {
                if (majorId == null) return true;
                Long studentMajorId = null;
                if (s.getAdministrativeClass() != null && s.getAdministrativeClass().getMajor() != null) {
                    studentMajorId = s.getAdministrativeClass().getMajor().getId();
                } else if (s.getCurriculum() != null && s.getCurriculum().getMajor() != null) {
                    studentMajorId = s.getCurriculum().getMajor().getId();
                }
                return majorId.equals(studentMajorId);
            })
            .collect(Collectors.groupingBy(
                com.example.demo.model.StudentProfile::getEnrollmentYear,
                Collectors.groupingBy(s -> s.getCurriculum().getId(), Collectors.counting())
            ));

        for (Map.Entry<Integer, Map<Long, Long>> cohortEntry : studentsByCohortAndCurr.entrySet()) {
            int enrollmentYear = cohortEntry.getKey();
            int curriculumSemester = (acadStartYear - enrollmentYear) * 2 + semesterOrder;

            if (curriculumSemester < 1 || curriculumSemester > 8) continue;

            for (Map.Entry<Long, Long> currEntry : cohortEntry.getValue().entrySet()) {
                Long currentCurriculumId = currEntry.getKey();
                Long studentCount = currEntry.getValue();

                List<com.example.demo.model.CurriculumSubject> mandatory = allCurriculumSubjects.stream()
                    .filter(cs -> cs.getCurriculum().getId().equals(currentCurriculumId) 
                               && cs.getRecommendedSemester().equals(curriculumSemester)
                               && cs.getIsRequired())
                    .collect(Collectors.toList());

                for (com.example.demo.model.CurriculumSubject cs : mandatory) {
                    com.example.demo.dto.CourseClassDemandAnalysisDTO dto = analysisMap.computeIfAbsent(cs.getSubject().getId(), id -> {
                        com.example.demo.dto.CourseClassDemandAnalysisDTO d = new com.example.demo.dto.CourseClassDemandAnalysisDTO();
                        d.setSubjectId(cs.getSubject().getId());
                        d.setSubjectCode(cs.getSubject().getSubjectCode());
                        d.setSubjectName(cs.getSubject().getName());
                        d.setMandatoryStudents(0);
                        d.setRepeatingStudents(0);
                        d.setRecommendedSemester(curriculumSemester);
                        return d;
                    });
                    dto.setMandatoryStudents(dto.getMandatoryStudents() + studentCount.intValue());
                }
            }
        }

        List<com.example.demo.model.CourseRegistration> allRegs = registrationRepository.findAll();
        Map<Long, Long> failedCounts = allRegs.stream()
            .filter(r -> r.getIsPassed() != null && !r.getIsPassed())
            .collect(Collectors.groupingBy(r -> r.getCourseClass().getSubject().getId(), Collectors.counting()));

        for (Map.Entry<Long, Long> entry : failedCounts.entrySet()) {
            if (analysisMap.containsKey(entry.getKey())) {
                analysisMap.get(entry.getKey()).setRepeatingStudents(entry.getValue().intValue());
            } else {
                Subject s = subjectRepository.findById(entry.getKey()).orElse(null);
                if (s != null) {
                    com.example.demo.dto.CourseClassDemandAnalysisDTO dto = new com.example.demo.dto.CourseClassDemandAnalysisDTO();
                    dto.setSubjectId(s.getId());
                    dto.setSubjectCode(s.getSubjectCode());
                    dto.setSubjectName(s.getName());
                    dto.setMandatoryStudents(0);
                    dto.setRepeatingStudents(entry.getValue().intValue());
                    analysisMap.put(s.getId(), dto);
                }
            }
        }

        List<CourseClass> currentClasses = courseClassRepository.findBySemesterId(semesterId);
        Map<Long, List<CourseClass>> classesBySubject = currentClasses.stream()
            .collect(Collectors.groupingBy(cc -> cc.getSubject().getId()));

        for (com.example.demo.dto.CourseClassDemandAnalysisDTO dto : analysisMap.values()) {
            List<CourseClass> subjectClasses = classesBySubject.getOrDefault(dto.getSubjectId(), new ArrayList<>());
            dto.setOpenedClasses(subjectClasses.size());
            dto.setCurrentCapacity(subjectClasses.stream().mapToInt(CourseClass::getMaxStudents).sum());
            dto.setTotalNeeded(dto.getMandatoryStudents() + dto.getRepeatingStudents());
            dto.setMissingSlots(Math.max(0, dto.getTotalNeeded() - dto.getCurrentCapacity()));
            
            if (dto.getMissingSlots() > 0) {
                int classSize = 40; 
                dto.setSuggestedMoreClasses((int) Math.ceil((double) dto.getMissingSlots() / classSize));
            } else {
                dto.setSuggestedMoreClasses(0);
            }
        }

        return new ArrayList<>(analysisMap.values());
    }
}
