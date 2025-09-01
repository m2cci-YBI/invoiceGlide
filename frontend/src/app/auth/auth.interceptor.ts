import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { API_BASE } from '../core/api-config';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private refreshing = false;

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const withAuth = this.addAuth(req);
    return next.handle(withAuth).pipe(
      catchError(err => {
        if (err instanceof HttpErrorResponse && err.status === 401 && this.auth.accessToken && !this.refreshing) {
          this.refreshing = true;
          return this.auth.refresh().pipe(
            switchMap(() => {
              this.refreshing = false;
              return next.handle(this.addAuth(req));
            }),
            catchError(e => {
              this.refreshing = false;
              return throwError(() => e);
            })
          );
        }
        return throwError(() => err);
      })
    );
  }

  private addAuth(req: HttpRequest<any>) {
    const isApi = typeof req.url === 'string' && req.url.startsWith(API_BASE);
    const isAuthEndpoint = isApi && /\/auth\//.test(req.url);
    if (this.auth.accessToken && !isAuthEndpoint) {
      return req.clone({ setHeaders: { Authorization: `Bearer ${this.auth.accessToken}` } });
    }
    return req;
  }
}
