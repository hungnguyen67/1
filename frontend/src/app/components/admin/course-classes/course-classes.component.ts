import { Component, OnInit } from '@angular/core';
import { CourseClassService, CourseSubjectGroup, CourseClass, ClassSchedule } from '../../../services/course-class.service';
import { Semester, SemesterService } from '../../../services/semester.service';
import { SubjectService, SubjectDTO } from '../../../services/subject.service';
import { LecturerService, LecturerDTO } from '../../../services/lecturer.service';
import { MajorService, MajorDTO } from '../../../services/major.service';
import { StudentService } from '../../../services/student.service';
import { CurriculumService, CurriculumDTO } from '../../../services/curriculum.service';

@Component({
    selector: 'app-course-classes',
    templateUrl: './course-classes.component.html'
})
export class CourseClassesComponent implements OnInit {
    subjects: CourseSubjectGroup[] = [];
    filteredSubjects: CourseSubjectGroup[] = [];
    selectedSubjectClasses: CourseClass[] = [];
    semesters: Semester[] = [];
    allSubjects: SubjectDTO[] = [];
    allLecturers: LecturerDTO[] = [];
    majors: MajorDTO[] = [];
    demandAnalysis: any[] = [];
    stats: any = {
        totalStudents: 0,
        mandatorySubjects: 0,
        subjectsToOpen: 0,
        totalClassesCreated: 0
    };
    showAnalysisTable = false;

    loading = false;
    loadingDetails = false;
    isSubmitting = false;
    searchTerm = '';
    selectedSemesterId: number | null = null;
    selectedMajorId: number | null = null;
    selectedYear: number | null = null;
    selectedProgramId: number | null = null;

    allCohorts: number[] = [];
    curriculums: CurriculumDTO[] = [];
    selectedSubject: CourseSubjectGroup | null = null;
    selectedDemand: any = null;

    isModalOpen = false;
    isDeleteModalOpen = false;
    modalMode: 'ADD' | 'EDIT' = 'ADD';
    courseClassForm: any = this.getEmptyForm();
    courseClassToDeleteId: number | null = null;

    constructor(
        private courseClassService: CourseClassService,
        private semesterService: SemesterService,
        private subjectService: SubjectService,
        private lecturerService: LecturerService,
        private majorService: MajorService,
        private studentService: StudentService,
        private curriculumService: CurriculumService
    ) { }

    ngOnInit(): void {
        this.loadSemesters();
        this.loadInitialData();
    }

    loadInitialData(): void {
        this.subjectService.getAllSubjects().subscribe(data => this.allSubjects = data);
        this.lecturerService.getLecturers().subscribe(data => this.allLecturers = data);

        // Load enrollment years
        this.studentService.getEnrollmentYears().subscribe(years => {
            this.allCohorts = years;
            // Default to 2023 or latest year if exists
            if (years.includes(2023)) this.selectedYear = 2023;
            else if (years.length > 0) this.selectedYear = years[years.length - 1];
        });

        // Load majors and set default
        this.majorService.getMajors().subscribe(data => {
            this.majors = data;
            if (data.length > 0) {
                // If there's a previously used major (not implemented yet), use it.
                // Otherwise default to first or based on some logic.
                this.selectedMajorId = data[0].id;
                this.onMajorChange();
            }
        });
    }

    onMajorChange(): void {
        this.selectedProgramId = null; // Clear Program selection
        if (this.selectedMajorId) {
            this.curriculumService.getCurriculumsByMajorId(this.selectedMajorId).subscribe(data => {
                this.curriculums = data;
            });
            this.loadAnalysis();
        } else {
            this.curriculums = [];
            this.loadAnalysis();
        }
    }

    onProgramChange(): void {
        this.loadAnalysis();
    }

    loadSemesters(): void {
        this.semesterService.getAllSemesters().subscribe(data => {
            this.semesters = data;
            const ongoing = data.find(s => s.semesterStatus === 'ONGOING');
            if (ongoing) {
                this.selectedSemesterId = ongoing.id;
            } else if (data.length > 0) {
                this.selectedSemesterId = data[0].id;
            }
            this.loadSubjects();
        });
    }

    getSelectedSemesterName(): string {
        const s = this.semesters.find(s => s.id == this.selectedSemesterId);
        return s ? `${s.name} (${s.academicYear})` : 'Chưa chọn';
    }

    loadSubjects(): void {
        if (!this.selectedSemesterId) return;
        this.loading = true;
        this.courseClassService.getGroupedSubjects(this.selectedSemesterId).subscribe({
            next: (data) => {
                this.subjects = data;
                this.filteredSubjects = data;
                this.loadAnalysis();
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading subjects', err);
                this.loading = false;
            }
        });
    }

    loadAnalysis(): void {
        if (!this.selectedSemesterId) return;
        this.courseClassService.getDemandAnalysis(
            this.selectedSemesterId,
            this.selectedYear || undefined,
            this.selectedMajorId || undefined,
            this.selectedProgramId || undefined
        ).subscribe(data => {
            this.demandAnalysis = data;
            this.calculateOverallStats();
        });
    }

    calculateOverallStats(): void {
        this.stats = {
            totalStudents: this.demandAnalysis.length > 0 ? this.demandAnalysis.reduce((max, a) => Math.max(max, a.totalNeeded), 0) : 0,
            mandatorySubjects: this.demandAnalysis.filter(a => a.mandatoryStudents > 0).length,
            subjectsToOpen: this.demandAnalysis.filter(a => a.suggestedMoreClasses > 0).length,
            totalClassesCreated: this.subjects.reduce((sum, s) => sum + s.classCount, 0)
        };
    }

    onFilterChange(): void {
        this.filteredSubjects = this.subjects.filter(s =>
            s.subjectName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            s.subjectCode.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
    }

    selectSubject(subject: CourseSubjectGroup): void {
        this.selectedSubject = subject;
        this.loadClassDetails(subject.subjectId);
    }

    loadClassDetails(subjectId: number): void {
        if (!this.selectedSemesterId) return;
        this.loadingDetails = true;
        this.courseClassService.getClassDetails(this.selectedSemesterId, subjectId).subscribe({
            next: (data) => {
                this.selectedSubjectClasses = data;
                this.loadingDetails = false;
            },
            error: (err) => {
                console.error('Error loading class details', err);
                this.loadingDetails = false;
            }
        });
    }

    closeDetails(): void {
        this.selectedSubject = null;
        this.selectedSubjectClasses = [];
    }

    openAddModal(subjectId?: number): void {
        this.modalMode = 'ADD';
        this.courseClassForm = this.getEmptyForm();
        if (subjectId) {
            this.courseClassForm.subjectId = subjectId;
            this.onSubjectSelect();
            this.autoSuggest(); // Call autoSuggest after subject selection
        }
        this.isModalOpen = true;
    }

    onSubjectSelect(): void {
        if (!this.courseClassForm.subjectId) {
            this.selectedDemand = null;
            return;
        }
        this.selectedDemand = this.demandAnalysis.find(a => a.subjectId == this.courseClassForm.subjectId);
        if (this.selectedDemand && this.modalMode === 'ADD') {
            this.courseClassForm.classCount = this.selectedDemand.suggestedMoreClasses || 1;
            this.onBatchCountChange();
        }
    }

    autoSuggest(): void {
        if (!this.selectedDemand) return;

        const subjectCode = this.selectedDemand.subjectCode;
        const nextNum = (this.selectedDemand.openedClasses || 0) + 1;
        this.courseClassForm.classCode = `${subjectCode}_${nextNum.toString().padStart(2, '0')}`;
        this.courseClassForm.maxStudents = 40;
        this.courseClassForm.classCount = this.selectedDemand.suggestedMoreClasses || 1;
        this.courseClassForm.classStatus = 'PLANNING';
        this.onBatchCountChange();
    }

    openEditModal(cc: any): void {
        this.modalMode = 'EDIT';
        this.courseClassForm = {
            id: cc.id,
            classCode: cc.classCode,
            subjectId: cc.subjectId,
            lecturerId: cc.lecturerId,
            maxStudents: cc.maxStudents,
            classStatus: cc.classStatus,
            currentEnrolled: cc.currentEnrolled,
            registrationStart: cc.registrationStart,
            registrationEnd: cc.registrationEnd,
            attendanceWeight: cc.attendanceWeight || 0.1,
            midtermWeight: cc.midtermWeight || 0.3,
            finalWeight: cc.finalWeight || 0.6,
            schedules: [...cc.schedules.map((s: any) => ({ ...s }))]
        };
        this.isModalOpen = true;
    }

    closeModal(): void {
        this.isModalOpen = false;
    }

    getEmptyForm(): any {
        return {
            classCode: '',
            subjectId: null,
            lecturerId: null,
            maxStudents: 40,
            classStatus: 'PLANNING',
            currentEnrolled: 0,
            registrationStart: null,
            registrationEnd: null,
            attendanceWeight: 0.10,
            midtermWeight: 0.30,
            finalWeight: 0.60,
            classCount: 1,
            batchLecturers: [null],
            schedules: []
        };
    }

    addSchedule(): void {
        this.courseClassForm.schedules.push({
            dayOfWeek: 2,
            startPeriod: 1,
            endPeriod: 3,
            roomName: '',
            sessionType: 'THEORY'
        });
    }

    removeSchedule(index: number): void {
        this.courseClassForm.schedules.splice(index, 1);
    }

    saveCourseClass(): void {
        if (!this.selectedSemesterId) return;
        this.isSubmitting = true;

        if (this.modalMode === 'ADD' && this.courseClassForm.classCount > 1) {
            this.createBatch();
            return;
        }

        const request = this.modalMode === 'ADD'
            ? this.courseClassService.createCourseClass(this.selectedSemesterId, this.courseClassForm)
            : this.courseClassService.updateCourseClass(this.courseClassForm.id, this.courseClassForm);

        request.subscribe({
            next: () => {
                this.finishSubmit();
            },
            error: (err) => {
                console.error('Error saving course class', err);
                this.isSubmitting = false;
            }
        });
    }

    createBatch(): void {
        const batch = [];
        // Use subjectCode as base for batch to avoid double suffix if classCode already has one
        const baseCode = this.selectedDemand ? this.selectedDemand.subjectCode : (this.courseClassForm.classCode.split('-')[0].split('_')[0]);

        for (let i = 0; i < this.courseClassForm.classCount; i++) {
            const cc = {
                ...this.courseClassForm,
                schedules: this.courseClassForm.schedules.map((s: any) => ({ ...s }))
            };
            cc.classCode = `${baseCode}-${(i + 1).toString().padStart(2, '0')}`;
            cc.lecturerId = this.courseClassForm.batchLecturers[i] || this.courseClassForm.lecturerId;
            batch.push(cc);
        }

        this.courseClassService.createBatchClasses(this.selectedSemesterId!, batch).subscribe({
            next: () => this.finishSubmit(),
            error: (err) => {
                console.error('Error creating batch', err);
                this.isSubmitting = false;
            }
        });
    }

    finishSubmit(): void {
        this.isSubmitting = false;
        this.closeModal();
        if (this.selectedSubject) {
            this.loadClassDetails(this.selectedSubject.subjectId);
        }
        this.loadSubjects();
    }

    onBatchCountChange(): void {
        const count = this.courseClassForm.classCount;
        while (this.courseClassForm.batchLecturers.length < count) {
            this.courseClassForm.batchLecturers.push(null);
        }
        if (this.courseClassForm.batchLecturers.length > count) {
            this.courseClassForm.batchLecturers = this.courseClassForm.batchLecturers.slice(0, count);
        }
    }

    confirmDelete(id: number): void {
        this.courseClassToDeleteId = id;
        this.isDeleteModalOpen = true;
    }

    deleteCourseClass(): void {
        if (!this.courseClassToDeleteId) return;
        this.isSubmitting = true;
        this.courseClassService.deleteCourseClass(this.courseClassToDeleteId).subscribe({
            next: () => {
                this.isSubmitting = false;
                this.isDeleteModalOpen = false;
                if (this.selectedSubject) {
                    this.loadClassDetails(this.selectedSubject.subjectId);
                }
                this.loadSubjects();
            },
            error: (err) => {
                console.error('Error deleting course class', err);
                this.isSubmitting = false;
            }
        });
    }

    getStatusClass(status: string): string {
        switch (status) {
            case 'OPEN_REGISTRATION': return 'bg-green-50 text-green-700 border-green-200';
            case 'FULL': return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'CLOSED': return 'bg-slate-50 text-slate-700 border-slate-200';
            case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-blue-50 text-blue-700 border-blue-200';
        }
    }

    getStatusLabel(status: string): string {
        switch (status) {
            case 'OPEN_REGISTRATION': return 'Đang đăng ký';
            case 'FULL': return 'Đã đầy';
            case 'CLOSED': return 'Đã khóa';
            case 'CANCELLED': return 'Đã hủy';
            case 'PLANNING': return 'Đang lập kế hoạch';
            default: return status;
        }
    }

    formatSchedule(schedules: any[]): string {
        if (!schedules || schedules.length === 0) return 'Chưa có lịch';
        return schedules.map(s => `Thứ ${s.dayOfWeek}: Tiết ${s.startPeriod}-${s.endPeriod}`).join(', ');
    }
}
