package com.example.demo.dto;

public class CourseClassDemandAnalysisDTO {
    private Long subjectId;
    private String subjectCode;
    private String subjectName;
    private Integer mandatoryStudents;
    private Integer repeatingStudents;
    private Integer totalNeeded;
    private Integer openedClasses;
    private Integer currentCapacity;
    private Integer missingSlots;
    private Integer recommendedSemester;
    private Integer suggestedMoreClasses;

    public CourseClassDemandAnalysisDTO() {}

    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }

    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public Integer getMandatoryStudents() { return mandatoryStudents; }
    public void setMandatoryStudents(Integer mandatoryStudents) { this.mandatoryStudents = mandatoryStudents; }

    public Integer getRepeatingStudents() { return repeatingStudents; }
    public void setRepeatingStudents(Integer repeatingStudents) { this.repeatingStudents = repeatingStudents; }

    public Integer getTotalNeeded() { return totalNeeded; }
    public void setTotalNeeded(Integer totalNeeded) { this.totalNeeded = totalNeeded; }

    public Integer getOpenedClasses() { return openedClasses; }
    public void setOpenedClasses(Integer openedClasses) { this.openedClasses = openedClasses; }

    public Integer getCurrentCapacity() { return currentCapacity; }
    public void setCurrentCapacity(Integer currentCapacity) { this.currentCapacity = currentCapacity; }

    public Integer getMissingSlots() { return missingSlots; }
    public void setMissingSlots(Integer missingSlots) { this.missingSlots = missingSlots; }

    public Integer getSuggestedMoreClasses() { return suggestedMoreClasses; }
    public void setSuggestedMoreClasses(Integer suggestedMoreClasses) { this.suggestedMoreClasses = suggestedMoreClasses; }

    public Integer getRecommendedSemester() { return recommendedSemester; }
    public void setRecommendedSemester(Integer recommendedSemester) { this.recommendedSemester = recommendedSemester; }
}
