import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastItem, ToastService } from '../toast.service';

@Component({
  selector: 'app-toast-container',
  templateUrl: './toast-container.component.html',
  styleUrls: ['./toast-container.component.css']
})
export class ToastContainerComponent implements OnInit, OnDestroy {
  toasts: ToastItem[] = [];
  private sub?: Subscription;

  constructor(private toast: ToastService) {}

  ngOnInit(): void {
    this.sub = this.toast.toasts$.subscribe(list => this.toasts = list);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  close(id: number) {
    this.toast.remove(id);
  }
}

