import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';
import { FlashMessageService } from '../../shared/services/flash-message.service';

@Component({
  selector: 'app-oauth2-redirect',
  template: `<div class="p-6">Đang chuyển hướng...</div>`
})
export class OAuth2RedirectComponent implements OnInit {
  constructor(private route: ActivatedRoute, private auth: AuthService, private router: Router, private flashMessage: FlashMessageService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log('OAuth2 redirect params:', params);
      const token = params['token'];
      const role = params['role'];
      const error = params['error'];
      const message = params['message'];
      const user = params['user'];
      if (error) {
        console.error('OAuth2 Error:', decodeURIComponent(error.replace(/\+/g, ' ')));
        this.router.navigate(['/login']);
      } else if (token) {
        this.auth.setToken(token);
        if (role) {
          this.auth.setRole(role);
        }
        if (user) {
          localStorage.setItem('user_info', decodeURIComponent(user.replace(/\+/g, ' ')));
        }
        if (message) {
          const decodedMessage = decodeURIComponent(message.replace(/\+/g, ' '));
          console.log('Setting flash message:', decodedMessage);
          this.flashMessage.success(decodedMessage);
        }
        const redirectPath = role === 'STUDENT' ? '/home' : '/dashboard';
        console.log('Navigating to:', redirectPath);
        setTimeout(() => this.router.navigate([redirectPath]), 100);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
