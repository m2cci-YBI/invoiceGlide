import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  form = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
  });
  status: 'idle' | 'pending' | 'success' | 'error' = 'idle';
  error = '';
  token = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'];
    if (!this.token) {
      this.status = 'error';
      this.error = 'No token provided';
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    if (this.form.value.password !== this.form.value.confirmPassword) {
      this.form.get('confirmPassword')?.setErrors({ mismatch: true });
      return;
    }
    this.status = 'pending';
    this.authService.resetPassword(this.token, this.form.value.password!).subscribe({
      next: () => {
        this.status = 'success';
        setTimeout(() => { this.router.navigate(['/auth'], { queryParams: { mode: 'login' } }); }, 3000);
      },
      error: (err) => {
        this.status = 'error';
        this.error = (err?.error?.error || err?.error?.message || '').toString() || 'An unknown error occurred';
      },
    });
  }
}
