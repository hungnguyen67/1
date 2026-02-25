import { Component, OnInit, HostListener } from '@angular/core';
import { Semester, SemesterService } from '../../../services/semester.service';

@Component({
    selector: 'app-semesters',
    templateUrl: './semesters.component.html'
})
export class SemestersComponent implements OnInit {
    // Data Lists
    semesters: Semester[] = [];
    filteredSemesters: Semester[] = [];
    paginatedSemesters: Semester[] = [];
    loading = true;

    // Pagination
    currentPage: number = 1;
    itemsPerPage: number = 10;

    // Search and Filter
    searchTerm: string = '';
    selectedYear: string = '';
    selectedStatus: string = '';
    academicYears: string[] = [];

    // UI State: Quản lý dropdown nào đang mở ('year' hoặc 'status' hoặc '')
    activeDropdown: string = '';

    // Modal State
    isEditModalOpen = false;
    isDeleteModalOpen = false;
    modalMode: 'ADD' | 'EDIT' = 'ADD';
    currentSemester: any = this.getEmptySemester();
    semesterToDeleteId: number | null = null;
    isSubmitting = false;

    constructor(private semesterService: SemesterService) { }

    ngOnInit(): void {
        this.loadSemesters();
    }

    // Tự động đóng dropdown khi click ra ngoài vùng dropdown
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        // Nếu click không nằm trong div chứa dropdown thì đóng lại
        if (!target.closest('.relative')) {
            this.activeDropdown = '';
        }
    }

    // --- GETTERS CHO TEMPLATE ---
    get totalPages(): number {
        return Math.ceil(this.filteredSemesters.length / this.itemsPerPage) || 1;
    }

    get minEnd(): number {
        return Math.min(this.currentPage * this.itemsPerPage, this.filteredSemesters.length);
    }

    // --- DATA LOADING ---
    loadSemesters(): void {
        this.loading = true;
        this.semesterService.getAllSemesters().subscribe({
            next: (data) => {
                this.semesters = data;
                this.extractAcademicYears();
                this.onFilterChange();
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading semesters', err);
                this.loading = false;
            }
        });
    }

    extractAcademicYears(): void {
        const years = new Set(this.semesters.map(s => s.academicYear));
        this.academicYears = Array.from(years).sort().reverse();
    }

    // --- FILTER & PAGINATION LOGIC ---
    onFilterChange(): void {
        this.filteredSemesters = this.semesters.filter(s => {
            const matchesSearch = s.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                s.academicYear.includes(this.searchTerm);
            const matchesYear = this.selectedYear ? s.academicYear === this.selectedYear : true;
            const matchesStatus = this.selectedStatus ? s.semesterStatus === this.selectedStatus : true;

            return matchesSearch && matchesYear && matchesStatus;
        });

        this.currentPage = 1;
        this.updatePagination();
    }

    updatePagination(): void {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.paginatedSemesters = this.filteredSemesters.slice(startIndex, endIndex);
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updatePagination();
        }
    }

    prevPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updatePagination();
        }
    }

    // --- MODAL OPERATIONS ---
    getEmptySemester(): any {
        const currentYear = new Date().getFullYear();
        return {
            name: '',
            academicYear: `${currentYear}-${currentYear + 1}`,
            semesterOrder: 1,
            startDate: '',
            endDate: '',
            semesterStatus: 'UPCOMING'
        };
    }

    openAddModal(): void {
        this.modalMode = 'ADD';
        this.currentSemester = this.getEmptySemester();
        this.isEditModalOpen = true;
    }

    openEditModal(semester: Semester): void {
        this.modalMode = 'EDIT';
        this.currentSemester = { ...semester };
        this.isEditModalOpen = true;
    }

    closeEditModal(): void {
        this.isEditModalOpen = false;
    }

    saveSemester(): void {
        if (!this.currentSemester.name || !this.currentSemester.academicYear) return;
        this.isSubmitting = true;
        const obs = this.modalMode === 'ADD'
            ? this.semesterService.createSemester(this.currentSemester)
            : this.semesterService.updateSemester(this.currentSemester.id, this.currentSemester);

        obs.subscribe({
            next: () => {
                this.loadSemesters();
                this.closeEditModal();
                this.isSubmitting = false;
            },
            error: (err) => {
                console.error('Error saving semester', err);
                this.isSubmitting = false;
            }
        });
    }

    openDeleteConfirmation(id: number): void {
        this.semesterToDeleteId = id;
        this.isDeleteModalOpen = true;
    }

    closeDeleteModal(): void {
        this.isDeleteModalOpen = false;
        this.semesterToDeleteId = null;
    }

    confirmDelete(): void {
        if (this.semesterToDeleteId === null) return;
        this.isSubmitting = true;
        this.semesterService.deleteSemester(this.semesterToDeleteId).subscribe({
            next: () => {
                this.loadSemesters();
                this.closeDeleteModal();
                this.isSubmitting = false;
            },
            error: (err) => {
                console.error('Error deleting semester', err);
                this.isSubmitting = false;
            }
        });
    }

    // --- HELPERS ---
    getStatusClass(status: string): string {
        switch (status) {
            case 'ONGOING': return 'bg-green-50 text-green-700 border-green-200';
            case 'UPCOMING': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'FINISHED': return 'bg-slate-50 text-slate-700 border-slate-200';
            default: return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    }

    getStatusLabel(status: string): string {
        switch (status) {
            case 'ONGOING': return 'Đang diễn ra';
            case 'UPCOMING': return 'Sắp tới';
            case 'FINISHED': return 'Đã kết thúc';
            default: return 'Tất cả trạng thái';
        }
    }
}