import { __decorate } from "tslib";
import { Component } from '@angular/core';
export let SettingsSubscriptionComponent = class SettingsSubscriptionComponent {
    constructor(subs, toast) {
        this.subs = subs;
        this.toast = toast;
        this.plans = [];
        this.loading = false;
    }
    ngOnInit() {
        this.refresh();
        this.subs.getPlans().subscribe(p => this.plans = p);
    }
    refresh() {
        this.subs.getMy().subscribe(s => this.sub = s);
    }
    startTrial() {
        this.loading = true;
        this.subs.subscribe('FREE_TRIAL_7D').subscribe({
            next: () => { this.toast.success('Trial started'); this.refresh(); },
            error: (e) => this.toast.error(e?.error?.error || 'Could not start trial'),
            complete: () => this.loading = false
        });
    }
    upgrade() {
        const paid = this.plans.find(p => (p.priceCents || 0) > 0 && p.stripePriceId);
        if (!paid) {
            this.toast.info('No paid plan configured yet');
            return;
        }
        this.subs.subscribe(paid.code).subscribe({
            next: (res) => {
                if (res.checkoutUrl) {
                    window.location.href = res.checkoutUrl;
                }
                else {
                    this.toast.success('Subscribed');
                    this.refresh();
                }
            },
            error: (e) => this.toast.error(e?.error?.error || 'Upgrade failed')
        });
    }
    manage() {
        this.subs.portal().subscribe({
            next: (res) => window.location.href = res.url,
            error: (e) => this.toast.error(e?.error?.error || 'Portal is unavailable')
        });
    }
};
SettingsSubscriptionComponent = __decorate([
    Component({
        selector: 'app-settings-subscription',
        templateUrl: './settings-subscription.component.html',
        styleUrls: ['./settings-subscription.component.css']
    })
], SettingsSubscriptionComponent);
//# sourceMappingURL=settings-subscription.component.js.map