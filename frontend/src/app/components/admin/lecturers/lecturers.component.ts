import { Component, OnInit } from '@angular/core';
import { LecturerService, LecturerDTO } from '../../../services/lecturer.service';
import { MajorService, MajorDTO } from '../../../services/major.service';

@Component({
    selector: 'app-lecturers',
    templateUrl: './lecturers.component.html'
})
export class LecturersComponent implements OnInit {

    lecturers: LecturerDTO[] = [];
    paginatedLecturers: LecturerDTO[] = [];
    searchTerm: string = '';
    filterMajor: number | null = null;
    majors: MajorDTO[] = [];
    activeDropdown: string = '';

    // Pagination
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

    loadMajors(): void {
        this.majorService.getMajors().subscribe(data => {
            this.majors = data;
        });
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

    getSelectedMajorName(): string {
        if (!this.filterMajor) return 'Tất cả các ngành';
        const major = this.majors.find(m => m.id === this.filterMajor);
        return major ? major.majorName : 'Tất cả các ngành';
    }

    onSearch(): void {
        this.loadLecturers();
    }

    resetFilters(): void {
        this.searchTerm = '';
        this.filterMajor = null;
        this.loadLecturers();
    }

    editLecturer(lecturer: LecturerDTO): void {
        console.log('Edit lecturer', lecturer);
    }

    deleteLecturer(lecturer: LecturerDTO): void {
        if (confirm('Bạn có chắc chắn muốn xóa giảng viên này?')) {
            // Implement delete logic in service and call it here
            console.log('Delete lecturer', lecturer);
        }
    }

    getGenderName(gender: string): string {
        switch (gender) {
            case 'Male': return 'Nam';
            case 'Female': return 'Nữ';
            case 'Other': return 'Khác';
            default: return 'Khác';
        }
    }
}
