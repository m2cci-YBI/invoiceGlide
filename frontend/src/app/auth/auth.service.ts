import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, switchMap } from 'rxjs';
import { API_BASE } from '../core/api-config';

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
}

const LS_ACCESS = 'auth.access';
const LS_REFRESH = 'auth.refresh';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _accessToken: string | null = localStorage.getItem(LS_ACCESS);
  private _refreshToken: string | null = localStorage.getItem(LS_REFRESH);
  private readonly _user$ = new BehaviorSubject<UserProfile | null>(null);
  readonly user$ = this._user$.asObservable();
  private readonly _ready$ = new BehaviorSubject<boolean>(false);
  readonly ready$ = this._ready$.asObservable();
  private http: HttpClient;

  constructor(private injector: Injector) {
    // Resolve HttpClient immediately to avoid race conditions when services are used on bootstrap routes
    this.http = this.injector.get(HttpClient);
    if (this._accessToken) {
      this.fetchMe().subscribe({
        next: () => { this._ready$.next(true); },
        error: () => { this.clear(); this._ready$.next(true); }
      });
    } else {
      this._ready$.next(true);
    }
  }

  get accessToken() { return this._accessToken; }
  get isAuthenticated() { return !!this._accessToken; }

  register(name: string, email: string, password: string) {
    // Do not auto-login on registration; just complete successfully
    return this.http.post<void>(`${API_BASE}/auth/register`, { name, email, password });
  }

  login(email: string, password: string) {
    return this.http.post<TokenResponse>(`${API_BASE}/auth/login`, { email, password }).pipe(
      tap(res => { this.setTokens(res); }),
      // Ensure user profile is loaded before callers proceed (prevents guard bounce)
      switchMap(() => this.fetchMe())
    );
  }

  confirmEmail(token: string) {
    return this.http.get<TokenResponse>(`${API_BASE}/auth/confirm-email?token=${token}`).pipe(
      tap(res => { this.setTokens(res); })
    );
  }

  resendConfirmation(email: string) {
    return this.http.post<void>(`${API_BASE}/auth/resend-confirmation`, { email });
  }

  forgotPassword(email: string) {
    return this.http.post<void>(`${API_BASE}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, password: string) {
    return this.http.post<void>(`${API_BASE}/auth/reset-password`, { token, password });
  }

  refresh() {
    if (!this._refreshToken) return new Observable<TokenResponse>(obs => obs.error('no refresh token'));
    return this.http.post<TokenResponse>(`${API_BASE}/auth/refresh`, { refreshToken: this._refreshToken }).pipe(
      tap(res => { this.setTokens(res); })
    );
  }

  logout() {
    return this.http.post<void>(`${API_BASE}/auth/logout`, {}).pipe(
      tap(() => { this.clear(); })
    );
  }

  fetchMe() {
    return this.http.get<UserProfile>(`${API_BASE}/users/me`).pipe(
      tap(user => { this._user$.next(user); })
    );
  }

  private setTokens(res: TokenResponse) {
    this._accessToken = res.accessToken;
    this._refreshToken = res.refreshToken;
    localStorage.setItem(LS_ACCESS, this._accessToken);
    localStorage.setItem(LS_REFRESH, this._refreshToken);
    this.fetchMe().subscribe();
  }

  private clear() {
    this._accessToken = null;
    this._refreshToken = null;
    localStorage.removeItem(LS_ACCESS);
    localStorage.removeItem(LS_REFRESH);
    this._user$.next(null);
  }
}
