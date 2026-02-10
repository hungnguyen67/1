import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';
import { FlashMessageService } from '../../shared/services/flash-message.service';
import { PasswordInputComponent } from '../../shared/components/password-input/password-input.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private flashMessage: FlashMessageService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.route.queryParams.subscribe(params => {
      this.flashMessage.clearAll();
      if (params['message']) {
        this.flashMessage.success(params['message']);
      }
      if (params['error']) {
        this.flashMessage.error(params['error']);
      }
    });
  }

  get passwordControl(): FormControl {
    return this.form.get('password') as FormControl;
  }

  submit() {
    if (this.form.invalid) {
      this.flashMessage.warning('Vui lòng kiểm tra lại thông tin nhập liệu!');
      return;
    }

    this.loading = true;
    const { email, password } = this.form.value;

    this.auth.login(email, password).subscribe({
      next: (res) => {
        this.loading = false;
        this.flashMessage.handleSuccess(res);

        const role = res?.user?.role;
        let targetUrl = '/home';
        if (role === 'ADMIN') {
          targetUrl = '/dashboard';
        }

        this.router.navigate([targetUrl]);
      },
      error: (err) => {
        this.loading = false;
        this.flashMessage.handleError(err);
      }
    });
  }

  loginWithGoogle() {
    window.location.href = this.auth.oauth2Url();
  }
}