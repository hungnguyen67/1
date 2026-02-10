import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth.service';
import { FlashMessageService } from '../../services/flash-message.service';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html'
})
export class UserLayoutComponent implements OnInit {
  isUserDropdownOpen = false;
  openMenuId: string | null = null;
  isSidebarCollapsed = false;
  currentUser: any = null;

  constructor(
    private auth: AuthService,
    private router: Router,
    private flashMessage: FlashMessageService
  ) { }

  ngOnInit() {
    this.loadUserData();
    this.autoExpandMenu();
  }

  // Tự động mở menu cha khi tải trang nếu đang ở trang con của nó
  autoExpandMenu() {
    const url = this.router.url;
    if (url.includes('/home/grades') || url.includes('/points') || url.includes('/curriculum')) {
      this.openMenuId = 'learning';
    } else if (url.includes('/register-course') || url.includes('/wishes') || url.includes('/results')) {
      this.openMenuId = 'registration';
    } else if (url.includes('/schedule') || url.includes('/exams')) {
      this.openMenuId = 'schedule';
    } else if (url.includes('/profile-setup')) {
      this.openMenuId = 'profile';
    }
  }

  loadUserData() {
    this.currentUser = this.auth.getUserFromStorage();
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    if (this.isSidebarCollapsed) this.openMenuId = null;
  }

  toggleMenu(menuId: string, event: Event) {
    event.stopPropagation();
    if (this.isSidebarCollapsed) {
      this.isSidebarCollapsed = false;
      this.openMenuId = menuId;
    } else {
      this.openMenuId = this.openMenuId === menuId ? null : menuId;
    }
  }

  // Kiểm tra xem URL hiện tại có khớp với mảng các đường dẫn hay không
  isParentActive(paths: string[]): boolean {
    return paths.some(path => this.router.url.includes(path));
  }

  getAvatarUrl(): string {
    if (!this.currentUser || !this.currentUser.avatar) {
      const name = this.currentUser?.name || 'User';
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff&size=80`;
    }
    return this.currentUser.avatar.startsWith('http')
      ? this.currentUser.avatar
      : 'http://localhost:8001' + this.currentUser.avatar;
  }

  toggleUserDropdown(event: Event) {
    event.stopPropagation();
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  @HostListener('document:click')
  closeDropdowns() {
    this.isUserDropdownOpen = false;
  }

  logout() {
    localStorage.clear();
    this.currentUser = null;
    this.router.navigate(['/login'], {
      queryParams: { message: 'Đăng xuất thành công!' }
    });
  }
}