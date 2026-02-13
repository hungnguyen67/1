import { Component, OnInit } from '@angular/core';
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

    loadMajor(id: number): void {
        this.majorService.getMajor(id).subscribe(data => {
            this.major = data;
        });
    }

    viewCurriculumDetail(curriculum: CurriculumDTO): void {
        this.router.navigate(['/dashboard/curriculums', curriculum.id]);
    }

    searchTerm: string = '';
    filterYear: number | null = null;
    filterStatus: string = '';
    filteredCurriculums: CurriculumDTO[] = [];
    years: number[] = [];
    activeDropdown: string = '';

    loadCurriculums(majorId: number): void {
        this.curriculumService.getCurriculumsByMajorId(majorId).subscribe(data => {
            this.curriculums = data;
            this.filteredCurriculums = data;
            this.extractYears();
            this.onSearch();
        });
    }

    extractYears(): void {
        const uniqueYears = new Set(this.curriculums.map(c => c.appliedYear));
        this.years = Array.from(uniqueYears).sort((a, b) => b - a);
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

    addCurriculum(): void {
        console.log('Add new curriculum');
    }

    editCurriculum(curriculum: CurriculumDTO): void {
        console.log('Edit curriculum', curriculum);
    }

    deleteMajor(major: MajorDTO | null): void {
        if (!major) return;
        if (confirm('Bạn có chắc chắn muốn xóa ngành này?')) {
            this.majorService.deleteMajor(major.id).subscribe(() => {
                this.router.navigate(['/dashboard/programs']);
            });
        }
    }

    currentPage: number = 1;
    itemsPerPage: number = 10;

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
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
        }
    }

    prevPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }
}
