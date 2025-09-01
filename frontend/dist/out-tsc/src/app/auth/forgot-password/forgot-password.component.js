import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
export let ForgotPasswordComponent = class ForgotPasswordComponent {
    constructor(fb, authService) {
        this.fb = fb;
        this.authService = authService;
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
        });
        this.status = 'idle';
        this.error = '';
    }
    onSubmit() {
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
};
ForgotPasswordComponent = __decorate([
    Component({
        selector: 'app-forgot-password',
        templateUrl: './forgot-password.component.html',
    })
], ForgotPasswordComponent);
//# sourceMappingURL=forgot-password.component.js.map