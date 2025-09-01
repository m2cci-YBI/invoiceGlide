import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastService } from '../shared/toast.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  mode: 'signup' | 'login' = 'signup';
  email = '';
  password = '';
  name = '';
  loading = false;
  errorMessage = '';
  signupSuccess = false;

  constructor(private route: ActivatedRoute, private router: Router, private auth: AuthService, private toast: ToastService) {}

  ngOnInit(): void {
    const m = this.route.snapshot.queryParamMap.get('mode');
    if (m === 'login' || m === 'signup') this.mode = m as any;
  }

  switchMode(next: 'signup' | 'login') {
    this.mode = next;
    this.router.navigate([], { queryParams: { mode: next }, queryParamsHandling: 'merge' });
    this.errorMessage = '';
  }

  submit() {
    if (!this.email || !this.password || (this.mode==='signup' && !this.name)) return;
    this.loading = true;
    this.errorMessage = '';
    if (this.mode === 'signup') {
      this.auth.register(this.name, this.email, this.password)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
        next: () => { this.signupSuccess = true; },
        error: (err) => {
          const msg: string = (err?.error?.error || err?.error?.message || '').toString();
          if (err?.status === 400 && msg.toLowerCase().includes('email already in use')) {
            this.errorMessage = 'An account with this email already exists. Please log in or use a different email address.';
          } else {
            this.errorMessage = 'Sign up failed. Please try again.';
          }
          this.toast.error(this.errorMessage);
        }
      });
    } else {
      this.auth.login(this.email, this.password)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
        next: () => { this.toast.success('Logged in'); this.router.navigate(['/dashboard']); },
        error: (err) => {
          if (err?.error?.message?.toLowerCase().includes('email not confirmed')) {
            this.errorMessage = 'Your email is not confirmed. Please check your inbox for a confirmation link.';
          } else {
            this.errorMessage = err?.error?.error || 'Login failed';
          }
          this.toast.error(this.errorMessage);
        }
      });
    }
  }
}
