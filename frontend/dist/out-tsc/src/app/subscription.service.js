import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { API_BASE } from './core/api-config';
export let SubscriptionService = class SubscriptionService {
    constructor(http) {
        this.http = http;
    }
    getPlans() {
        return this.http.get(`${API_BASE}/plans`);
    }
    getMy() {
        return this.http.get(`${API_BASE}/subscriptions/me`);
    }
    subscribe(planCode) {
        return this.http.post(`${API_BASE}/subscriptions`, { planCode });
    }
    portal() {
        return this.http.post(`${API_BASE}/billing/portal-session`, {});
    }
};
SubscriptionService = __decorate([
    Injectable({ providedIn: 'root' })
], SubscriptionService);
//# sourceMappingURL=subscription.service.js.map