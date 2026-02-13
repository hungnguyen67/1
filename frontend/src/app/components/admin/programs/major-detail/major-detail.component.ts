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

    loadCurriculums(majorId: number): void {
        this.curriculumService.getCurriculumsByMajorId(majorId).subscribe(data => {
            this.curriculums = data;
        });
    }

    viewCurriculumDetail(curriculum: CurriculumDTO): void {
        this.router.navigate(['/dashboard/curriculums', curriculum.id]);
    }

    editCurriculum(curriculum: CurriculumDTO): void {
        console.log('Edit curriculum', curriculum);
        // Implement navigation to edit page if exists
    }

    deleteCurriculum(curriculum: CurriculumDTO): void {
        if (confirm('Bạn có chắc chắn muốn xóa chương trình đào tạo này?')) {
            this.curriculumService.deleteCurriculum(curriculum.id).subscribe(() => {
                if (this.major) {
                    this.loadCurriculums(this.major.id);
                }
            });
        }
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
        return Math.ceil(this.curriculums.length / this.itemsPerPage);
    }

    get paginatedCurriculums(): CurriculumDTO[] {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        return this.curriculums.slice(startIndex, startIndex + this.itemsPerPage);
    }

    get minEnd(): number {
        return Math.min(this.currentPage * this.itemsPerPage, this.curriculums.length);
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
