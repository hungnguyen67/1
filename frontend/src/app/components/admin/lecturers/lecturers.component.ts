import { Component, OnInit, HostListener } from '@angular/core';
import { LecturerService, LecturerDTO } from '../../../services/lecturer.service';
import { MajorService, MajorDTO } from '../../../services/major.service';

@Component({
    selector: 'app-lecturers',
    templateUrl: './lecturers.component.html'
})
export class LecturersComponent implements OnInit {

    lecturers: LecturerDTO[] = [];
    paginatedLecturers: LecturerDTO[] = [];
    majors: MajorDTO[] = [];

    searchTerm: string = '';
    filterMajor: number | null = null;
    activeDropdown: string = '';

    currentPage: number = 1;
    itemsPerPage: number = 10;

    constructor(
        private lecturerService: LecturerService,
        private majorService: MajorService
    ) { }

    ngOnInit(): void {
        this.loadMajors();
        this.loadLecturers();
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest('.relative')) {
            this.activeDropdown = '';
        }
    }

    loadMajors(): void {
        this.majorService.getMajors().subscribe(data => this.majors = data);
    }

    loadLecturers(): void {
        this.lecturerService.getLecturers(this.searchTerm, this.filterMajor || undefined).subscribe(data => {
            this.lecturers = data;
            this.currentPage = 1;
            this.updatePagination();
        });
    }

    updatePagination(): void {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.paginatedLecturers = this.lecturers.slice(startIndex, endIndex);
    }

    onSearch(): void {
        this.loadLecturers();
    }

    resetFilters(): void {
        this.searchTerm = '';
        this.filterMajor = null;
        this.loadLecturers();
    }

    getSelectedMajorName(): string {
        if (!this.filterMajor) return 'Tất cả các ngành học';
        const major = this.majors.find(m => m.id === this.filterMajor);
        return major ? major.majorName : 'Tất cả các ngành học';
    }

    get totalPages(): number {
        return Math.ceil(this.lecturers.length / this.itemsPerPage) || 1;
    }

    get minEnd(): number {
        return Math.min(this.currentPage * this.itemsPerPage, this.lecturers.length);
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

    getGenderName(gender: string): string {
        const map: any = { 'Male': 'Nam', 'Female': 'Nữ', 'Other': 'Khác' };
        return map[gender] || 'Khác';
    }

    editLecturer(lecturer: LecturerDTO): void {
        console.log('Edit', lecturer);
    }

    deleteLecturer(lecturer: LecturerDTO): void {
        if (confirm(`Xác nhận xóa giảng viên ${lecturer.fullName}?`)) {
            console.log('Delete', lecturer.id);
        }
    }
}