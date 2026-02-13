import { Component, HostListener, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, map } from 'rxjs/operators';
import { AuthService } from '../../../auth.service';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html'
})
export class DashboardLayoutComponent implements OnInit {
  title = 'Tổng quan';
  isUserDropdownOpen = false;
  isSidebarOpen = true;
  openMenuName: string | null = null;

  currentUser: any = null;
  isAdmin: boolean = false;

  constructor(
    private auth: AuthService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadUserData();
    this.autoOpenMenuBasedOnUrl(this.router.url);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.autoOpenMenuBasedOnUrl(event.urlAfterRedirects);
      this.updateTitle();
      this.cdr.detectChanges();
    });
  }

  private updateTitle() {
    let route = this.activatedRoute.firstChild;
    while (route?.firstChild) route = route.firstChild;
    this.title = route?.snapshot.data['title'] || 'Tổng quan';
  }

  autoOpenMenuBasedOnUrl(url: string) {
    const path = url.split('?')[0];

    if (path.includes('/dashboard/users')) {
      this.openMenuName = 'users';
    }
    else if (path.includes('/dashboard/programs') ||
      path.includes('/dashboard/knowledge-blocks') ||
      path.includes('/dashboard/subjects') ||
      path.includes('/dashboard/curriculum') ||
      path.includes('/dashboard/curriculums')) {
      this.openMenuName = 'academic';
    }
    else if (path.includes('/dashboard/students') ||
      path.includes('/dashboard/lecturers') ||
      path.includes('/dashboard/administrative-classes')) {
      this.openMenuName = 'profiles';
    }
    else if (path.includes('/dashboard/semesters') ||
      path.includes('/dashboard/sections') ||
      path.includes('/dashboard/schedules') ||
      path.includes('/dashboard/exams')) {
      this.openMenuName = 'operation';
    }
    else if (path.includes('/dashboard/registrations') ||
      path.includes('/dashboard/grades') ||
      path.includes('/dashboard/attendance')) {
      this.openMenuName = 'learning';
    }
    else {
      this.openMenuName = null;
    }

    this.cdr.detectChanges();
  }

  loadUserData() {
    this.currentUser = this.auth.getUserFromStorage();
    this.isAdmin = this.auth.getRole() === 'ADMIN';
  }

  getAvatarUrl(): string {
    if (!this.currentUser?.avatar) {
      const name = this.currentUser?.first_name || 'Admin';
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff`;
    }
    return this.currentUser.avatar.startsWith('http')
      ? this.currentUser.avatar
      : `http://localhost:8001${this.currentUser.avatar}`;
  }

  isMenuOpen(menuName: string): boolean {
    return this.isSidebarOpen && this.openMenuName === menuName;
  }

  isGroupActive(urls: string[]): boolean {
    const currentUrl = this.router.url.split('?')[0];
    return urls.some(url => currentUrl === url || currentUrl.startsWith(url + '/'));
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    if (this.isSidebarOpen) {
      this.autoOpenMenuBasedOnUrl(this.router.url);
    } else {
      this.openMenuName = null;
    }
  }

  toggleAdminMenu(menuName: string, event: Event) {
    event.stopPropagation();
    if (!this.isSidebarOpen) {
      this.isSidebarOpen = true;
      this.openMenuName = menuName;
    } else {
      this.openMenuName = this.openMenuName === menuName ? null : menuName;
    }
  }

  toggleUserDropdown(event: Event) {
    event.stopPropagation();
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  @HostListener('document:click')
  closeDropdown() {
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