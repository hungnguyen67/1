import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardLayoutComponent } from './shared/layouts/dashboard-layout/dashboard-layout.component';
import { UserLayoutComponent } from './shared/layouts/user-layout/user-layout.component';
import { OAuth2RedirectComponent } from './components/oauth2-redirect/oauth2-redirect.component';
import { UsersComponent } from './components/users/users.component';
import { SettingsComponent } from './shared/layouts/setting-layout/setting-layout.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { FlashMessageComponent } from './shared/components/flash-message/flash-message.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { PasswordChecklistComponent } from './shared/components/password-checklist/password-checklist.component';
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
      { path: 'grades', component: HomeComponent }
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
      {
        path: 'settings',
        component: SettingsComponent,
        children: [
          { path: '', redirectTo: 'profile', pathMatch: 'full' },
          { path: 'profile', component: ProfileComponent },
          { path: 'change-password', component: ChangePasswordComponent },
          { path: 'notifications', component: ProfileComponent }
        ]
      },
      { path: 'profile', component: ProfileComponent },
      { path: 'programs', component: DashboardComponent },
      { path: 'students', component: DashboardComponent },
      { path: 'subjects', component: DashboardComponent },
      { path: 'class-sections', component: DashboardComponent },
      { path: 'enrollments', component: DashboardComponent },
      { path: 'grades', component: DashboardComponent }
    ]
  },
  { path: 'oauth2/redirect', component: OAuth2RedirectComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }