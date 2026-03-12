import { Component, OnInit } from '@angular/core';
import { CourseClassService, CourseSubjectGroup, CourseClass, ClassSchedule } from '../../../services/course-class.service';
import { Semester, SemesterService } from '../../../services/semester.service';
import { SubjectService, SubjectDTO } from '../../../services/subject.service';
import { LecturerService, LecturerDTO } from '../../../services/lecturer.service';
import { MajorService, MajorDTO } from '../../../services/major.service';
import { StudentService } from '../../../services/student.service';
import { CurriculumService, CurriculumDTO } from '../../../services/curriculum.service';
import { AdministrativeClassService, AdministrativeClassDTO } from '../../../services/administrative-class.service';

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
    filteredDemandAnalysis: any[] = [];
    stats: any = {
        totalStudents: 0,
        mandatorySubjects: 0,
        subjectsToOpen: 0,
        totalClassesCreated: 0
    };
    activeTab: 'statistics' | 'list' = 'statistics';
    showAnalysisTable = false;
    selectedDemandKeys = new Set<string>();
    allSelected = false;

    // Pagination - Bảng Thống kê dự kiến
    demandCurrentPage = 1;
    demandItemsPerPage = 10;
    demandTotalItems = 0;
    get demandTotalPages(): number { return Math.max(1, Math.ceil(this.demandTotalItems / this.demandItemsPerPage)); }
    get demandMinEnd(): number { return Math.min(this.demandCurrentPage * this.demandItemsPerPage, this.demandTotalItems); }
    pagedDemandAnalysis: any[] = [];

    // Pagination - Bảng Danh sách Lớp HP
    subjectCurrentPage = 1;
    subjectItemsPerPage = 10;
    subjectTotalItems = 0;
    get subjectTotalPages(): number { return Math.max(1, Math.ceil(this.subjectTotalItems / this.subjectItemsPerPage)); }
    get subjectMinEnd(): number { return Math.min(this.subjectCurrentPage * this.subjectItemsPerPage, this.subjectTotalItems); }
    pagedSubjects: any[] = [];

    loading = false;
    loadingDetails = false;
    isSubmitting = false;
    searchTerm = '';
    selectedSemesterId: number | null = null;
    selectedMajorId: number | null = null;
    selectedYear: number | null = null;
    selectedAdminClassId: number | null = null;
    groupBy: 'both' | 'subject' = 'both';
    activeDropdown: string = '';

    allCohorts: number[] = [];
    administrativeClasses: AdministrativeClassDTO[] = [];
    filteredAdminClasses: AdministrativeClassDTO[] = [];
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
        private curriculumService: CurriculumService,
        private adminClassService: AdministrativeClassService
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
                this.selectedMajorId = data[0].id;
                this.onMajorChange();
            }
        });

        this.adminClassService.getClasses().subscribe(data => {
            this.administrativeClasses = data;
            this.filteredAdminClasses = data;
        });
    }

    onMajorChange(): void {
        if (this.selectedMajorId) {
            this.curriculumService.getCurriculumsByMajorId(this.selectedMajorId).subscribe(data => {
                this.curriculums = data;
            });
            this.filteredAdminClasses = this.administrativeClasses.filter(c => c.majorId == this.selectedMajorId);
            this.loadAnalysis();
        } else {
            this.curriculums = [];
            this.filteredAdminClasses = this.administrativeClasses;
            this.loadAnalysis();
        }
    }

    onGroupByChange(): void {
        this.selectedYear = null;
        this.selectedAdminClassId = null;
        this.onFilterChange();
    }

    resetFilters(): void {
        this.selectedYear = null;
        this.selectedAdminClassId = null;
        this.selectedMajorId = null;
        this.searchTerm = '';
        this.groupBy = 'both';
        this.onMajorChange();
        this.onFilterChange();
    }

    getSelectedMajorName(): string {
        if (!this.selectedMajorId) return 'Tất cả các ngành học';
        const major = this.majors.find(m => m.id == this.selectedMajorId);
        return major ? major.majorName : 'Tất cả các ngành học';
    }

    getSelectedAdvisorName(): string {
        if (!this.selectedAdminClassId) return 'Tất cả lớp hành chính';
        const adminClass = this.administrativeClasses.find(c => c.id == this.selectedAdminClassId);
        return adminClass ? adminClass.className : 'Tất cả lớp hành chính';
    }

    getSelectedLecturerName(): string {
        if (!this.selectedYear) return 'Tất cả cố vấn';
        const lecturer = this.allLecturers.find(l => l.id == this.selectedYear);
        return lecturer ? lecturer.fullName : 'Tất cả cố vấn';
    }

    onSearch(): void {
        this.onFilterChange();
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
            this.selectedMajorId || undefined
        ).subscribe(data => {
            this.demandAnalysis = data;
            this.onFilterChange();
            this.calculateOverallStats();
        });
    }

    calculateOverallStats(): void {
        this.stats = {
            totalStudents: this.demandAnalysis.reduce((sum, a) => sum + (a.totalNeeded || 0), 0),
            mandatorySubjects: this.demandAnalysis.filter(a => a.mandatoryStudents > 0).length,
            subjectsToOpen: this.demandAnalysis.filter(a => a.suggestedMoreClasses > 0).length,
            totalClassesCreated: this.subjects.reduce((sum, s) => sum + s.classCount, 0)
        };
    }

    toggleSelectAll(): void {
        this.allSelected = !this.allSelected;
        if (this.allSelected) {
            this.filteredDemandAnalysis.forEach(d => {
                const key = `${d.subjectId}_${d.adminClassId}`;
                this.selectedDemandKeys.add(key);
            });
        } else {
            this.selectedDemandKeys.clear();
        }
    }

    toggleSelect(demand: any): void {
        const key = `${demand.subjectId}_${demand.adminClassId}`;
        if (this.selectedDemandKeys.has(key)) {
            this.selectedDemandKeys.delete(key);
        } else {
            this.selectedDemandKeys.add(key);
        }
        this.allSelected = this.selectedDemandKeys.size === this.filteredDemandAnalysis.length && this.filteredDemandAnalysis.length > 0;
    }

    isDemandSelected(demand: any): boolean {
        return this.selectedDemandKeys.has(`${demand.subjectId}_${demand.adminClassId}`);
    }

    generateBatchClasses(): void {
        if (this.groupBy === 'subject') {
            alert('Vui lòng chuyển sang "Nhóm theo Môn & Lớp" để thực hiện khởi tạo hàng loạt cho từng lớp hành chính!');
            return;
        }
        if (this.selectedDemandKeys.size === 0) {
            alert('Vui lòng chọn ít nhất một môn học để khởi tạo!');
            return;
        }

        const demandsToCreate = this.filteredDemandAnalysis.filter(d =>
            this.selectedDemandKeys.has(`${d.subjectId}_${d.adminClassId}`));

        if (!confirm(`Xác nhận khởi tạo ${demandsToCreate.length} lớp học phần hàng loạt?`)) return;

        this.loading = true;
        this.courseClassService.generateAutoBatch(this.selectedSemesterId!, demandsToCreate)
            .subscribe({
                next: (res) => {
                    const createdCount = res.length;
                    const skippedCount = demandsToCreate.length - createdCount;

                    let msg = `Đã xử lý xong!`;
                    if (createdCount > 0) msg += `\n- Thành công: ${createdCount} lớp.`;
                    if (skippedCount > 0) msg += `\n- Bỏ qua (đã tồn tại): ${skippedCount} lớp.`;

                    alert(msg);
                    this.selectedDemandKeys.clear();
                    this.allSelected = false;
                    this.loadAnalysis();
                    this.loadSubjects();
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Batch creation failed', err);
                    alert('Khởi tạo hàng loạt thất bại!');
                    this.loading = false;
                }
            });
    }

    onFilterChange(): void {
        const search = this.searchTerm.toLowerCase();

        // Filter subjects
        const allFiltered = this.subjects.filter(s =>
            s.subjectName.toLowerCase().includes(search) ||
            s.subjectCode.toLowerCase().includes(search)
        );
        this.subjectTotalItems = allFiltered.length;
        this.subjectCurrentPage = 1;
        this.updateSubjectPage(allFiltered);
        this.filteredSubjects = this.pagedSubjects;

        // Filter demand
        let filtered = this.demandAnalysis.filter(a => {
            const matchesSearch = a.subjectName.toLowerCase().includes(search) || a.subjectCode.toLowerCase().includes(search);
            const matchesYear = !this.selectedYear || a.cohort === Number(this.selectedYear);
            const matchesClass = !this.selectedAdminClassId || a.adminClassId == this.selectedAdminClassId;
            return matchesSearch && matchesYear && matchesClass;
        });

        this.demandTotalItems = filtered.length;
        this.demandCurrentPage = 1;
        this.updateDemandPage(filtered);
        this.filteredDemandAnalysis = this.pagedDemandAnalysis;

        this.selectedDemandKeys.clear();
        this.allSelected = false;
    }

    private _allFilteredDemand: any[] = [];
    private _allFilteredSubjects: any[] = [];

    updateDemandPage(allData?: any[]): void {
        if (allData) this._allFilteredDemand = allData;
        const start = (this.demandCurrentPage - 1) * this.demandItemsPerPage;
        this.pagedDemandAnalysis = this._allFilteredDemand.slice(start, start + this.demandItemsPerPage);
        this.filteredDemandAnalysis = this.pagedDemandAnalysis;
    }

    updateSubjectPage(allData?: any[]): void {
        if (allData) this._allFilteredSubjects = allData;
        const start = (this.subjectCurrentPage - 1) * this.subjectItemsPerPage;
        this.pagedSubjects = this._allFilteredSubjects.slice(start, start + this.subjectItemsPerPage);
        this.filteredSubjects = this.pagedSubjects;
    }

    demandPrevPage(): void { if (this.demandCurrentPage > 1) { this.demandCurrentPage--; this.updateDemandPage(); } }
    demandNextPage(): void { if (this.demandCurrentPage < this.demandTotalPages) { this.demandCurrentPage++; this.updateDemandPage(); } }
    subjectPrevPage(): void { if (this.subjectCurrentPage > 1) { this.subjectCurrentPage--; this.updateSubjectPage(); } }
    subjectNextPage(): void { if (this.subjectCurrentPage < this.subjectTotalPages) { this.subjectCurrentPage++; this.updateSubjectPage(); } }

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
            this.autoSuggest();
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
