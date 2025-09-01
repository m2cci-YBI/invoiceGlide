import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from './core/api-config';

export interface Plan {
  id: string;
  code: string;
  name: string;
  priceCents?: number;
  currency?: string;
  interval?: 'MONTH' | 'YEAR';
  trialDays?: number;
  active?: boolean;
  featuresJson?: string;
  stripePriceId?: string;
}

export interface SubscriptionDto {
  id?: string;
  userId?: string;
  planCode?: string;
  status?: 'TRIALING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'EXPIRED';
  startAt?: string;
  trialEndAt?: string | null;
  currentPeriodEnd?: string | null;
  daysLeft?: number | null;
}

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  constructor(private http: HttpClient) {}

  getPlans() {
    return this.http.get<Plan[]>(`${API_BASE}/plans`);
  }

  getMy() {
    return this.http.get<SubscriptionDto | {}>(`${API_BASE}/subscriptions/me`);
  }

  subscribe(planCode: string) {
    return this.http.post<SubscriptionDto | { checkoutUrl: string }>(`${API_BASE}/subscriptions`, { planCode });
  }

  portal() {
    return this.http.post<{ url: string }>(`${API_BASE}/billing/portal-session`, {});
  }
}

