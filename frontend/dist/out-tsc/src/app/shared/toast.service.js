import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
export let ToastService = class ToastService {
    constructor() {
        this.counter = 1;
        this._toasts$ = new BehaviorSubject([]);
        this.toasts$ = this._toasts$.asObservable();
    }
    success(message, duration = 3000) { this.push('success', message, duration); }
    error(message, duration = 4000) { this.push('error', message, duration); }
    info(message, duration = 3000) { this.push('info', message, duration); }
    remove(id) {
        const next = this._toasts$.value.filter(t => t.id !== id);
        this._toasts$.next(next);
    }
    clear() { this._toasts$.next([]); }
    push(type, message, duration) {
        const id = this.counter++;
        const item = { id, type, message, duration };
        this._toasts$.next([...this._toasts$.value, item]);
        setTimeout(() => this.remove(id), duration);
    }
};
ToastService = __decorate([
    Injectable({ providedIn: 'root' })
], ToastService);
//# sourceMappingURL=toast.service.js.map