import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
})
export class EmailConfirmationComponent implements OnInit {
  status: 'pending' | 'success' | 'error' = 'pending';
  error = '';
  resendForm = this.fb.group({ email: ['', [Validators.required, Validators.email]] });
  resendStatus: 'idle' | 'pending' | 'success' | 'error' = 'idle';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParams['token'];
    if (!token) {
      this.status = 'error';
      this.error = 'No token provided';
      return;
    }

    this.authService.confirmEmail(token).subscribe({
      next: () => {
        this.status = 'success';
        setTimeout(() => { this.router.navigate(['/']); }, 3000);
      },
      error: (err) => {
        this.status = 'error';
        this.error = (err?.error?.error || err?.error?.message || '').toString() || 'An unknown error occurred';
      },
    });
  }

  resend(): void {
    if (this.resendForm.invalid) return;
    const email = this.resendForm.value.email!;
    this.resendStatus = 'pending';
    this.authService.resendConfirmation(email).subscribe({
      next: () => this.resendStatus = 'success',
      error: () => this.resendStatus = 'error'
    });
  }
}
