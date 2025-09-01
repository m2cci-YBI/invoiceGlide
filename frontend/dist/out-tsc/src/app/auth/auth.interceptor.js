import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
export let AuthInterceptor = class AuthInterceptor {
    constructor(auth) {
        this.auth = auth;
        this.refreshing = false;
    }
    intercept(req, next) {
        const withAuth = this.addAuth(req);
        return next.handle(withAuth).pipe(catchError(err => {
            if (err instanceof HttpErrorResponse && err.status === 401 && this.auth.accessToken && !this.refreshing) {
                this.refreshing = true;
                return this.auth.refresh().pipe(switchMap(() => {
                    this.refreshing = false;
                    return next.handle(this.addAuth(req));
                }), catchError(e => {
                    this.refreshing = false;
                    return throwError(() => e);
                }));
            }
            return throwError(() => err);
        }));
    }
    addAuth(req) {
        if (this.auth.accessToken) {
            return req.clone({ setHeaders: { Authorization: `Bearer ${this.auth.accessToken}` } });
        }
        return req;
    }
};
AuthInterceptor = __decorate([
    Injectable()
], AuthInterceptor);
//# sourceMappingURL=auth.interceptor.js.map