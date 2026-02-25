import { Component, OnInit } from '@angular/core';
import { CourseClassService, CourseSubjectGroup, CourseClass, ClassSchedule } from '../../../services/course-class.service';
import { Semester, SemesterService } from '../../../services/semester.service';
import { SubjectService, SubjectDTO } from '../../../services/subject.service';
import { LecturerService, LecturerDTO } from '../../../services/lecturer.service';

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

    loading = false;
    loadingDetails = false;
    isSubmitting = false;
    searchTerm = '';
    selectedSemesterId: number | null = null;
    selectedSubject: CourseSubjectGroup | null = null;

    // Modal State
    isModalOpen = false;
    isDeleteModalOpen = false;
    modalMode: 'ADD' | 'EDIT' = 'ADD';
    courseClassForm: any = this.getEmptyForm();
    courseClassToDeleteId: number | null = null;

    constructor(
        private courseClassService: CourseClassService,
        private semesterService: SemesterService,
        private subjectService: SubjectService,
        private lecturerService: LecturerService
    ) { }

    ngOnInit(): void {
        this.loadSemesters();
        this.loadInitialData();
    }

    loadInitialData(): void {
        this.subjectService.getAllSubjects().subscribe(data => this.allSubjects = data);
        this.lecturerService.getLecturers().subscribe(data => this.allLecturers = data);
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

    loadSubjects(): void {
        if (!this.selectedSemesterId) return;
        this.loading = true;
        this.courseClassService.getGroupedSubjects(this.selectedSemesterId).subscribe({
            next: (data) => {
                this.subjects = data;
                this.filteredSubjects = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading subjects', err);
                this.loading = false;
            }
        });
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

    // CRUD Actions
    openAddModal(subjectId?: number): void {
        this.modalMode = 'ADD';
        this.courseClassForm = this.getEmptyForm();
        if (subjectId) {
            this.courseClassForm.subjectId = subjectId;
        }
        this.isModalOpen = true;
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

        const request = this.modalMode === 'ADD'
            ? this.courseClassService.createCourseClass(this.selectedSemesterId, this.courseClassForm)
            : this.courseClassService.updateCourseClass(this.courseClassForm.id, this.courseClassForm);

        request.subscribe({
            next: () => {
                this.isSubmitting = false;
                this.closeModal();
                if (this.selectedSubject) {
                    this.loadClassDetails(this.selectedSubject.subjectId);
                }
                this.loadSubjects();
            },
            error: (err) => {
                console.error('Error saving course class', err);
                this.isSubmitting = false;
            }
        });
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

    // Helpers
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
