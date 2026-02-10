import { Component, OnInit } from '@angular/core';
import { MajorService, MajorDTO } from '../../services/major.service';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html'
})
export class ProgramsComponent implements OnInit {

  majors: MajorDTO[] = [];
  filteredMajors: MajorDTO[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private majorService: MajorService) { }

  ngOnInit(): void {
    this.loadMajors();
  }

  loadMajors(): void {
    this.majorService.getMajors().subscribe(data => {
      this.majors = data;
      this.filteredMajors = [...this.majors];
      this.sortData();
    });
  }

  onSearch(): void {
    this.filteredMajors = this.majors.filter(major =>
      major.majorCode.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      major.majorName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      major.facultyName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
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

  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortData();
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

  editMajor(major: MajorDTO): void {
    // Implement edit logic
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