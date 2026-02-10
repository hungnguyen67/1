import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth.service';
import { HttpClient } from '@angular/common/http';
import { FlashMessageService } from '../../../shared/services/flash-message.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 10;
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  filterRole = 'LECTURER';
  filterStatus = 'ACTIVE';
  filterVerified = 'true';
  showInviteForm = false;
  inviteEmail = '';
  inviteRole = 'STUDENT';
  inviting = false;
  availableRoles: any[] = [];
  showDeleteModal = false;
  userToDelete: any = null;
  deletingUser = false;
  activeDropdown: string = '';

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private flashMessage: FlashMessageService
  ) { }

  toggleDropdown(type: string) {
    this.activeDropdown = this.activeDropdown === type ? '' : type;
  }

  selectRole(value: string) {
    this.filterRole = value;
    this.onSearch();
  }

  getStatusLabel() {
    const statuses: any = { 'ACTIVE': 'Hoạt động', 'LOCKED': 'Đã khóa', 'DISABLED': 'Vô hiệu hóa' };
    return statuses[this.filterStatus] || 'Tất cả Trạng thái';
  }

  getVerifyLabel() {
    const verifies: any = { 'true': 'Đã xác thực', 'false': 'Chưa xác thực' };
    return verifies[this.filterVerified] || 'Tất cả Xác thực';
  }

  getRoleLabel() {
    const roles: any = { 'LECTURER': 'Giảng viên', 'STUDENT': 'Sinh viên' };
    return roles[this.filterRole] || 'Tất cả Vai trò';
  }

  ngOnInit() {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers() {
    this.auth.getUsers().subscribe({
      next: (res) => {
        this.users = res.users || [];
        this.onSearch();
      },
      error: (err) => {
        this.flashMessage.handleError(err);
      }
    });
  }

  onSearch() {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm ||
        user.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.phone?.includes(this.searchTerm);

      const matchesRole = !this.filterRole || user.role === this.filterRole;
      const matchesStatus = !this.filterStatus || (user.accountStatus || 'ACTIVE') === this.filterStatus;
      const matchesVerified = !this.filterVerified ||
        (this.filterVerified === 'true' ? user.isEmailVerified : !user.isEmailVerified);

      return matchesSearch && matchesRole && matchesStatus && matchesVerified;
    });
    this.currentPage = 1;
    this.sortData();
  }

  sortData() {
    if (this.sortColumn) {
      this.filteredUsers.sort((a, b) => {
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

  get paginatedUsers(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredUsers.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  get minEnd(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredUsers.length);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  loadRoles() {
    this.http.get('http://localhost:8001/api/admin/roles', this.auth.getAuthHeaders()).subscribe({
      next: (res: any) => this.availableRoles = res.roles || [],
      error: () => this.availableRoles = [
        { name: 'STUDENT', description: 'Sinh viên' },
        { name: 'LECTURER', description: 'Giảng viên' }
      ]
    });
  }

  inviteUser() {
    if (!this.inviteEmail) {
      this.flashMessage.error('Vui lòng nhập Email');
      return;
    }
    this.inviting = true;
    this.http.post('http://localhost:8001/api/admin/users', {
      email: this.inviteEmail,
      role: this.inviteRole
    }, this.auth.getAuthHeaders()).subscribe({
      next: (res: any) => {
        this.inviting = false;
        this.flashMessage.success(res.message);
        this.closeInviteModal();
        this.loadUsers();
      },
      error: (err) => {
        this.inviting = false;
        const errorMessage = err.error?.error || 'Có lỗi xảy ra khi gửi lời mời';
        this.flashMessage.error(errorMessage);
      }
    });
  }

  openDeleteModal(user: any) {
    this.userToDelete = user;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (!this.userToDelete) return;
    this.deletingUser = true;
    this.auth.deleteUser(this.userToDelete.id).subscribe({
      next: () => {
        this.flashMessage.success(`Đã xóa người dùng ${this.userToDelete.name} thành công`);
        this.closeDeleteModal();
        this.loadUsers();
      },
      error: (err) => {
        this.deletingUser = false;
        this.flashMessage.handleError(err);
      }
    });
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.userToDelete = null;
    this.deletingUser = false;
  }

  closeInviteModal() {
    this.showInviteForm = false;
    this.inviteEmail = '';
    this.inviteRole = 'STUDENT';
  }

  handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeInviteModal();
      this.closeDeleteModal();
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

  getStatusName(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'Hoạt động';
      case 'LOCKED': return 'Đã khóa';
      case 'DISABLED': return 'Vô hiệu hóa';
      default: return status || 'Hoạt động';
    }
  }

  getVerifiedStatus(verified: boolean): string {
    return verified ? 'Đã xác thực' : 'Chưa xác thực';
  }

  getRoleName(role: string): string {
    switch (role) {
      case 'STUDENT': return 'Sinh viên';
      case 'LECTURER': return 'Giảng viên';
      default: return role;
    }
  }
}