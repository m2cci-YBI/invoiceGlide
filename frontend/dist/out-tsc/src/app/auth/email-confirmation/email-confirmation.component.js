import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
export let EmailConfirmationComponent = class EmailConfirmationComponent {
    constructor(route, router, authService, fb) {
        this.route = route;
        this.router = router;
        this.authService = authService;
        this.fb = fb;
        this.status = 'pending';
        this.error = '';
        this.resendForm = this.fb.group({ email: ['', [Validators.required, Validators.email]] });
        this.resendStatus = 'idle';
    }
    ngOnInit() {
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
    resend() {
        if (this.resendForm.invalid)
            return;
        const email = this.resendForm.value.email;
        this.resendStatus = 'pending';
        this.authService.resendConfirmation(email).subscribe({
            next: () => this.resendStatus = 'success',
            error: () => this.resendStatus = 'error'
        });
    }
};
EmailConfirmationComponent = __decorate([
    Component({
        selector: 'app-email-confirmation',
        templateUrl: './email-confirmation.component.html',
    })
], EmailConfirmationComponent);
//# sourceMappingURL=email-confirmation.component.js.map