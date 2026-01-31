import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class PasswordInputComponent {
  @Input() control: any; 
  @Input() placeholder: string = '';
  showPassword = false;

  toggle() {
    this.showPassword = !this.showPassword;
  }
}