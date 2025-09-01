import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });
  status: 'idle' | 'pending' | 'success' | 'error' = 'idle';
  error = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    this.status = 'pending';
    const email = (this.form.value.email || '').trim();
    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.status = 'success';
      },
      error: (err) => {
        this.status = 'error';
        this.error = (err?.error?.error || err?.error?.message || '').toString() || 'An unknown error occurred';
      },
    });
  }
}
