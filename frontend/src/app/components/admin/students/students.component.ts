import { Component, OnInit } from '@angular/core';
import { StudentDTO, StudentService } from '../../../services/student.service';
import { MajorDTO, MajorService } from '../../../services/major.service';
import { AdministrativeClassDTO, AdministrativeClassService } from '../../../services/administrative-class.service';

@Component({
    selector: 'app-students',
    templateUrl: './students.component.html'
})
export class StudentsComponent implements OnInit {
    students: StudentDTO[] = [];
    paginatedStudents: StudentDTO[] = [];
    majors: MajorDTO[] = [];
    classes: AdministrativeClassDTO[] = [];
    activeDropdown: string = '';

    filters = {
        searchTerm: '',
        majorId: null as number | null,
        classId: null as number | null,
        enrollmentYear: null as number | null,
        status: '',
        minGpa: null as number | null,
        maxGpa: null as number | null
    };

    // Pagination
    currentPage = 1;
    pageSize = 10;
    totalItems = 0;

    constructor(
        private studentService: StudentService,
        private majorService: MajorService,
        private classService: AdministrativeClassService
    ) { }

    ngOnInit(): void {
        this.loadMajors();
        this.loadClasses();
        this.loadStudents();
    }

    loadMajors(): void {
        this.majorService.getMajors().subscribe(data => {
            this.majors = data;
        });
    }

    loadClasses(): void {
        this.classService.getClasses().subscribe(data => {
            this.classes = data;
        });
    }

    loadStudents(): void {
        this.studentService.getStudents(this.filters).subscribe(data => {
            this.students = data;
            this.totalItems = data.length;
            this.currentPage = 1;
            this.updatePagination();
        });
    }

    updatePagination(): void {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.paginatedStudents = this.students.slice(startIndex, endIndex);
    }

    get totalPages(): number {
        return Math.ceil(this.students.length / this.pageSize) || 1;
    }

    get minEnd(): number {
        return Math.min(this.currentPage * this.pageSize, this.students.length);
    }

    applyFilters(): void {
        this.loadStudents();
    }

    resetFilters(): void {
        this.filters = {
            searchTerm: '',
            majorId: null,
            classId: null,
            enrollmentYear: null,
            status: '',
            minGpa: null,
            maxGpa: null
        };
        this.applyFilters();
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
        if (!this.filters.majorId) return 'Tất cả các ngành';
        const major = this.majors.find(m => m.id === Number(this.filters.majorId));
        return major ? major.majorName : 'Tất cả các ngành';
    }

    getSelectedClassName(): string {
        if (!this.filters.classId) return 'Tất cả các lớp';
        const clazz = this.classes.find(c => c.id === Number(this.filters.classId));
        return clazz ? clazz.classCode : 'Tất cả các lớp';
    }

    getSelectedStatusName(): string {
        if (!this.filters.status) return 'Tất cả trạng thái';
        return this.getStatusName(this.filters.status);
    }

    getStatusBadgeClass(status: string): string {
        switch (status) {
            case 'STUDYING': return 'bg-blue-100 text-blue-700';
            case 'GRADUATED': return 'bg-green-100 text-green-700';
            case 'RESERVED': return 'bg-yellow-100 text-yellow-700';
            case 'DROPPED': return 'bg-red-100 text-red-700';
            case 'SUSPENDED': return 'bg-orange-100 text-orange-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    }

    getStatusName(status: string): string {
        switch (status) {
            case 'STUDYING': return 'Đang học';
            case 'GRADUATED': return 'Đã tốt nghiệp';
            case 'RESERVED': return 'Bảo lưu';
            case 'DROPPED': return 'Thôi học';
            case 'SUSPENDED': return 'Đình chỉ';
            default: return status || '---';
        }
    }

    editStudent(student: StudentDTO): void {
        console.log('Edit student', student);
    }

    deleteStudent(student: StudentDTO): void {
        if (confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) {
            console.log('Delete student', student);
        }
    }
}
