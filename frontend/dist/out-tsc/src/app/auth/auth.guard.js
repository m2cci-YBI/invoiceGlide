import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { take, map, filter, switchMap } from 'rxjs';
export let AuthGuard = class AuthGuard {
    constructor(auth, router) {
        this.auth = auth;
        this.router = router;
    }
    canActivate() {
        return this.auth.ready$.pipe(filter(ready => ready), switchMap(() => this.auth.user$), take(1), map(user => {
            if (user)
                return true;
            return this.router.parseUrl('/auth?mode=login');
        }));
    }
    canActivateChild(childRoute, state) {
        return this.canActivate();
    }
};
AuthGuard = __decorate([
    Injectable({ providedIn: 'root' })
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map