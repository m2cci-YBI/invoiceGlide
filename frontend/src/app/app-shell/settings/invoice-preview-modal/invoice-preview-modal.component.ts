import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-invoice-preview-modal',
  templateUrl: './invoice-preview-modal.component.html',
  styleUrls: ['./invoice-preview-modal.component.css']
})
export class InvoicePreviewModalComponent {
  @Output() close = new EventEmitter<void>();
}