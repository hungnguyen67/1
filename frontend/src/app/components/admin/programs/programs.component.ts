import { Component, OnInit } from '@angular/core';
import { MajorService, MajorDTO } from '../../../services/major.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html'
})
export class ProgramsComponent implements OnInit {

  majors: MajorDTO[] = [];
  filteredMajors: MajorDTO[] = [];
  searchTerm: string = '';
  filterFaculty: string = '';
  faculties: string[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  activeDropdown: string = '';

  constructor(private majorService: MajorService, private router: Router) { }

  ngOnInit(): void {
    this.loadMajors();
  }

  loadMajors(): void {
    this.majorService.getMajors().subscribe(data => {
      console.log('Majors data:', data);
      this.majors = data;
      this.extractFaculties();
      this.onSearch();
    });
  }

  extractFaculties(): void {
    const uniqueFaculties = new Set(this.majors.map(m => m.facultyName));
    this.faculties = Array.from(uniqueFaculties).sort();
  }

  onSearch(): void {
    this.filteredMajors = this.majors.filter(major => {
      const matchesSearch = !this.searchTerm ||
        major.majorCode.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        major.majorName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        major.facultyName.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesFaculty = !this.filterFaculty || major.facultyName === this.filterFaculty;

      return matchesSearch && matchesFaculty;
    });
    this.currentPage = 1;
    this.sortData();
  }

  sortData(): void {
    if (this.sortColumn) {
      this.filteredMajors.sort((a, b) => {
        let aValue = (a as any)[this.sortColumn];
        let bValue = (b as any)[this.sortColumn];
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
  }

  get paginatedMajors(): MajorDTO[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredMajors.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredMajors.length / this.itemsPerPage);
  }

  get minEnd(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredMajors.length);
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

  viewMajorDetail(major: MajorDTO): void {
    this.router.navigate(['/dashboard/programs', major.id]);
  }

  editMajor(major: MajorDTO): void {
    this.router.navigate(['/admin/majors', major.id, 'edit']);
    console.log('Edit major', major);
  }

  deleteMajor(major: MajorDTO): void {
    if (confirm('Bạn có chắc chắn muốn xóa ngành này?')) {
      this.majorService.deleteMajor(major.id).subscribe(() => {
        this.loadMajors();
      });
    }
  }
}