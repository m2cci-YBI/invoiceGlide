import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { finalize } from 'rxjs/operators';
export let AuthComponent = class AuthComponent {
    constructor(route, router, auth, toast) {
        this.route = route;
        this.router = router;
        this.auth = auth;
        this.toast = toast;
        this.mode = 'signup';
        this.email = '';
        this.password = '';
        this.name = '';
        this.loading = false;
        this.errorMessage = '';
        this.signupSuccess = false;
    }
    ngOnInit() {
        const m = this.route.snapshot.queryParamMap.get('mode');
        if (m === 'login' || m === 'signup')
            this.mode = m;
    }
    switchMode(next) {
        this.mode = next;
        this.router.navigate([], { queryParams: { mode: next }, queryParamsHandling: 'merge' });
        this.errorMessage = '';
    }
    submit() {
        if (!this.email || !this.password || (this.mode === 'signup' && !this.name))
            return;
        this.loading = true;
        this.errorMessage = '';
        if (this.mode === 'signup') {
            this.auth.register(this.name, this.email, this.password)
                .pipe(finalize(() => this.loading = false))
                .subscribe({
                next: () => { this.signupSuccess = true; },
                error: (err) => {
                    const msg = (err?.error?.error || err?.error?.message || '').toString();
                    if (err?.status === 400 && msg.toLowerCase().includes('email already in use')) {
                        this.errorMessage = 'An account with this email already exists. Please log in or use a different email address.';
                    }
                    else {
                        this.errorMessage = 'Sign up failed. Please try again.';
                    }
                    this.toast.error(this.errorMessage);
                }
            });
        }
        else {
            this.auth.login(this.email, this.password)
                .pipe(finalize(() => this.loading = false))
                .subscribe({
                next: () => { this.toast.success('Logged in'); this.router.navigate(['/dashboard']); },
                error: (err) => {
                    if (err?.error?.message?.toLowerCase().includes('email not confirmed')) {
                        this.errorMessage = 'Your email is not confirmed. Please check your inbox for a confirmation link.';
                    }
                    else {
                        this.errorMessage = err?.error?.error || 'Login failed';
                    }
                    this.toast.error(this.errorMessage);
                }
            });
        }
    }
};
AuthComponent = __decorate([
    Component({
        selector: 'app-auth',
        templateUrl: './auth.component.html',
        styleUrls: ['./auth.component.css']
    })
], AuthComponent);
//# sourceMappingURL=auth.component.js.map