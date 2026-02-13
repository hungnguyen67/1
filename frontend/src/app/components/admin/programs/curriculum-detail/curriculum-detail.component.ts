import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurriculumService, CurriculumDTO, KnowledgeBlockDetailDTO } from '../../../../services/curriculum.service';

@Component({
    selector: 'app-curriculum-detail',
    templateUrl: './curriculum-detail.component.html'
})
export class CurriculumDetailComponent implements OnInit {

    curriculum: CurriculumDTO | null = null;
    blocks: KnowledgeBlockDetailDTO[] = [];

    constructor(
        private route: ActivatedRoute,
        public router: Router,
        private curriculumService: CurriculumService
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadCurriculum(+id);
        }
    }

    loadCurriculum(id: number): void {
        this.curriculumService.getCurriculum(id).subscribe(data => {
            this.curriculum = data;
        });
        this.curriculumService.getCurriculumDetails(id).subscribe(data => {
            this.blocks = data;
        });
    }
}
