import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, switchMap } from 'rxjs';
import { API_BASE } from '../core/api-config';
const LS_ACCESS = 'auth.access';
const LS_REFRESH = 'auth.refresh';
export let AuthService = class AuthService {
    constructor(injector) {
        this.injector = injector;
        this._accessToken = localStorage.getItem(LS_ACCESS);
        this._refreshToken = localStorage.getItem(LS_REFRESH);
        this._user$ = new BehaviorSubject(null);
        this.user$ = this._user$.asObservable();
        this._ready$ = new BehaviorSubject(false);
        this.ready$ = this._ready$.asObservable();
        // Resolve HttpClient immediately to avoid race conditions when services are used on bootstrap routes
        this.http = this.injector.get(HttpClient);
        if (this._accessToken) {
            this.fetchMe().subscribe({
                next: () => { this._ready$.next(true); },
                error: () => { this.clear(); this._ready$.next(true); }
            });
        }
        else {
            this._ready$.next(true);
        }
    }
    get accessToken() { return this._accessToken; }
    get isAuthenticated() { return !!this._accessToken; }
    register(name, email, password) {
        // Do not auto-login on registration; just complete successfully
        return this.http.post(`${API_BASE}/auth/register`, { name, email, password });
    }
    login(email, password) {
        return this.http.post(`${API_BASE}/auth/login`, { email, password }).pipe(tap(res => { this.setTokens(res); }), 
        // Ensure user profile is loaded before callers proceed (prevents guard bounce)
        switchMap(() => this.fetchMe()));
    }
    confirmEmail(token) {
        return this.http.get(`${API_BASE}/auth/confirm-email?token=${token}`).pipe(tap(res => { this.setTokens(res); }));
    }
    resendConfirmation(email) {
        return this.http.post(`${API_BASE}/auth/resend-confirmation`, { email });
    }
    forgotPassword(email) {
        return this.http.post(`${API_BASE}/auth/forgot-password`, { email });
    }
    resetPassword(token, password) {
        return this.http.post(`${API_BASE}/auth/reset-password`, { token, password });
    }
    refresh() {
        if (!this._refreshToken)
            return new Observable(obs => obs.error('no refresh token'));
        return this.http.post(`${API_BASE}/auth/refresh`, { refreshToken: this._refreshToken }).pipe(tap(res => { this.setTokens(res); }));
    }
    logout() {
        return this.http.post(`${API_BASE}/auth/logout`, {}).pipe(tap(() => { this.clear(); }));
    }
    fetchMe() {
        return this.http.get(`${API_BASE}/users/me`).pipe(tap(user => { this._user$.next(user); }));
    }
    setTokens(res) {
        this._accessToken = res.accessToken;
        this._refreshToken = res.refreshToken;
        localStorage.setItem(LS_ACCESS, this._accessToken);
        localStorage.setItem(LS_REFRESH, this._refreshToken);
        this.fetchMe().subscribe();
    }
    clear() {
        this._accessToken = null;
        this._refreshToken = null;
        localStorage.removeItem(LS_ACCESS);
        localStorage.removeItem(LS_REFRESH);
        this._user$.next(null);
    }
};
AuthService = __decorate([
    Injectable({ providedIn: 'root' })
], AuthService);
//# sourceMappingURL=auth.service.js.map