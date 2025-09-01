import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicePreviewModalComponent } from './invoice-preview-modal.component';

describe('InvoicePreviewModalComponent', () => {
  let component: InvoicePreviewModalComponent;
  let fixture: ComponentFixture<InvoicePreviewModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvoicePreviewModalComponent]
    });
    fixture = TestBed.createComponent(InvoicePreviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
