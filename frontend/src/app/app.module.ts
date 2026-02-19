import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { DashboardLayoutComponent } from './shared/layouts/dashboard-layout/dashboard-layout.component';
import { UserLayoutComponent } from './shared/layouts/user-layout/user-layout.component';
import { OAuth2RedirectComponent } from './components/oauth2-redirect/oauth2-redirect.component';
import { UsersComponent } from './components/admin/users/users.component';
import { SettingsComponent } from './shared/layouts/setting-layout/setting-layout.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { FlashMessageComponent } from './shared/components/flash-message/flash-message.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { PasswordChecklistComponent } from './shared/components/password-checklist/password-checklist.component';
// import { ScheduleComponent } from './components/admin/schedule/schedule.component';
import { MiniCalendarComponent } from './shared/components/mini-calendar/mini-calendar.component';
import { ProgramsComponent } from './components/admin/programs/programs.component';
import { MajorDetailComponent } from './components/admin/programs/major-detail/major-detail.component';
import { CurriculumDetailComponent } from './components/admin/programs/curriculum-detail/curriculum-detail.component';
import { LecturersComponent } from './components/admin/lecturers/lecturers.component';
import { StudentsComponent } from './components/admin/students/students.component';
import { AuthGuard } from './auth.guard';
import { AuthInterceptor } from './auth.interceptor';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: 'home',
    component: UserLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: HomeComponent },
      { path: 'grades', component: HomeComponent },
      // { path: 'schedule', component: ScheduleComponent }
    ]
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'semesters-list', component: DashboardComponent },
      { path: 'programs', component: ProgramsComponent },
      { path: 'programs/:id', component: MajorDetailComponent },
      { path: 'curriculums/:id', component: CurriculumDetailComponent },
      { path: 'knowledge-blocks', component: DashboardComponent },
      { path: 'administrative-classes', component: DashboardComponent },
      { path: 'lecturers', component: LecturersComponent },
      { path: 'students', component: StudentsComponent },
      { path: 'subjects', component: DashboardComponent },
      { path: 'sections', component: DashboardComponent },
      // { path: 'schedules', component: ScheduleComponent },
      { path: 'exams', component: DashboardComponent },
      { path: 'grades', component: DashboardComponent },
      { path: 'reports', component: DashboardComponent },
      { path: 'notifications', component: DashboardComponent },
      {
        path: 'settings',
        component: SettingsComponent,
        children: [
          { path: '', redirectTo: 'profile', pathMatch: 'full' },
          { path: 'profile', component: ProfileComponent },
          { path: 'change-password', component: ChangePasswordComponent },
          { path: 'notifications', component: ProfileComponent }
        ]
      }
    ]
  },
  { path: 'oauth2/redirect', component: OAuth2RedirectComponent },
  { path: '**', redirectTo: '' }
];

import { FormsModule } from '@angular/forms';
import { PasswordInputComponent } from './shared/components/password-input/password-input.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    DashboardLayoutComponent,
    UserLayoutComponent,
    OAuth2RedirectComponent,
    UsersComponent,
    SettingsComponent,
    ProfileComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ChangePasswordComponent,
    // ScheduleComponent,
    MiniCalendarComponent,
    ProgramsComponent,
    MajorDetailComponent,
    CurriculumDetailComponent,
    LecturersComponent,
    StudentsComponent,
    DashboardComponent,
    DashboardComponent,
    DashboardComponent,
    DashboardComponent,
    FlashMessageComponent,
    PasswordChecklistComponent,
    PasswordInputComponent,
    DashboardComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }