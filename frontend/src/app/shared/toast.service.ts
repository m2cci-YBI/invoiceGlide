import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
  duration: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 1;
  private readonly _toasts$ = new BehaviorSubject<ToastItem[]>([]);
  readonly toasts$ = this._toasts$.asObservable();

  success(message: string, duration = 3000) { this.push('success', message, duration); }
  error(message: string, duration = 4000) { this.push('error', message, duration); }
  info(message: string, duration = 3000) { this.push('info', message, duration); }

  remove(id: number) {
    const next = this._toasts$.value.filter(t => t.id !== id);
    this._toasts$.next(next);
  }

  clear() { this._toasts$.next([]); }

  private push(type: ToastType, message: string, duration: number) {
    const id = this.counter++;
    const item: ToastItem = { id, type, message, duration };
    this._toasts$.next([...this._toasts$.value, item]);
    setTimeout(() => this.remove(id), duration);
  }
}

