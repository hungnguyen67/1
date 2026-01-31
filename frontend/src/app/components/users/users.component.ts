import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';
import { HttpClient } from '@angular/common/http';
import { FlashMessageService } from '../../shared/services/flash-message.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  loading = false;

  // Logic Mời người dùng
  showInviteForm = false;
  inviteEmail = '';
  inviteRole = 'STUDENT';
  inviting = false;
  availableRoles: any[] = [];

  // Logic Xóa người dùng (Mới thêm)
  showDeleteModal = false;
  userToDelete: any = null;
  deletingUser = false;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private flashMessage: FlashMessageService
  ) { }

  ngOnInit() {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers() {
    this.loading = true;
    this.auth.getUsers().subscribe({
      next: (res) => {
        this.users = res.users || [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.flashMessage.handleError(err);
      }
    });
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

  // --- HÀM XỬ LÝ XÓA MỚI ---
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
}