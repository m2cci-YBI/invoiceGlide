import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
export let ResetPasswordComponent = class ResetPasswordComponent {
    constructor(fb, route, router, authService) {
        this.fb = fb;
        this.route = route;
        this.router = router;
        this.authService = authService;
        this.form = this.fb.group({
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', [Validators.required]],
        });
        this.status = 'idle';
        this.error = '';
        this.token = '';
    }
    ngOnInit() {
        this.token = this.route.snapshot.queryParams['token'];
        if (!this.token) {
            this.status = 'error';
            this.error = 'No token provided';
        }
    }
    onSubmit() {
        if (this.form.invalid) {
            return;
        }
        if (this.form.value.password !== this.form.value.confirmPassword) {
            this.form.get('confirmPassword')?.setErrors({ mismatch: true });
            return;
        }
        this.status = 'pending';
        this.authService.resetPassword(this.token, this.form.value.password).subscribe({
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
};
ResetPasswordComponent = __decorate([
    Component({
        selector: 'app-reset-password',
        templateUrl: './reset-password.component.html',
    })
], ResetPasswordComponent);
//# sourceMappingURL=reset-password.component.js.map