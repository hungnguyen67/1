import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MajorService, MajorDTO } from '../../../../services/major.service';
import { CurriculumService, CurriculumDTO } from '../../../../services/curriculum.service';

@Component({
    selector: 'app-major-detail',
    templateUrl: './major-detail.component.html'
})
export class MajorDetailComponent implements OnInit {
    major: MajorDTO | null = null;
    curriculums: CurriculumDTO[] = [];
    filteredCurriculums: CurriculumDTO[] = [];
    years: number[] = [];
    searchTerm: string = '';
    filterYear: number | null = null;
    filterStatus: string = '';
    activeDropdown: string = '';
    currentPage: number = 1;
    itemsPerPage: number = 10;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private majorService: MajorService,
        private curriculumService: CurriculumService
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadMajor(+id);
            this.loadCurriculums(+id);
        }
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest('.filter-dropdown-container')) {
            this.activeDropdown = '';
        }
    }

    loadMajor(id: number): void {
        this.majorService.getMajor(id).subscribe(data => {
            this.major = data;
        });
    }

    loadCurriculums(majorId: number): void {
        this.curriculumService.getCurriculumsByMajorId(majorId).subscribe(data => {
            this.curriculums = data;
            this.onSearch();
        });
    }

    onSearch(): void {
        this.filteredCurriculums = this.curriculums.filter(c => {
            const matchesSearch = !this.searchTerm ||
                c.curriculumName.toLowerCase().includes(this.searchTerm.toLowerCase());
            const matchesYear = !this.filterYear || c.appliedYear === this.filterYear;
            const matchesStatus = !this.filterStatus || c.status === this.filterStatus;
            return matchesSearch && matchesYear && matchesStatus;
        });
        this.currentPage = 1;
    }

    viewCurriculumDetail(curriculum: CurriculumDTO): void {
        this.router.navigate(['/dashboard/curriculums', curriculum.id]);
    }

    deleteMajor(major: MajorDTO | null): void {
        if (!major) return;
        if (confirm('Bạn có chắc chắn muốn xóa ngành này?')) {
            this.majorService.deleteMajor(major.id).subscribe(() => {
                this.router.navigate(['/dashboard/programs']);
            });
        }
    }

    // Getters cho phân trang
    get totalPages(): number {
        return Math.ceil(this.filteredCurriculums.length / this.itemsPerPage);
    }

    get paginatedCurriculums(): CurriculumDTO[] {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        return this.filteredCurriculums.slice(startIndex, startIndex + this.itemsPerPage);
    }

    get minEnd(): number {
        return Math.min(this.currentPage * this.itemsPerPage, this.filteredCurriculums.length);
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) this.currentPage++;
    }

    prevPage(): void {
        if (this.currentPage > 1) this.currentPage--;
    }
}