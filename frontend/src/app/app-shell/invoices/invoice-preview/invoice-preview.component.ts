import { Component, Input, OnChanges } from '@angular/core';
import { SettingsService } from '../../../settings.service';

export interface PreviewTax { name: string; ratePct: number }
export interface PreviewLine { description: string; qty: number; unit?: string; price: number; taxes?: number[] }
export interface PreviewDiscount { name: string; type: 'percent' | 'amount'; value: number }
export interface PreviewInvoice {
  number?: string;
  issueDate?: string;
  dueDate?: string;
  client?: { name: string; email?: string; address?: string };
  lines: PreviewLine[];
  invoiceTaxes: PreviewTax[];
  invoiceDiscounts?: PreviewDiscount[];
  notes?: string;
  currency?: string;
}

@Component({
  selector: 'app-invoice-preview',
  templateUrl: './invoice-preview.component.html',
  styleUrls: ['./invoice-preview.component.css']
})
export class InvoicePreviewComponent implements OnChanges {
  @Input() invoice!: PreviewInvoice;

  subtotal = 0;
  tax = 0;
  total = 0;
  perTaxTotals: { name: string; ratePct: number; amount: number }[] = [];
  perDiscountTotals: { name: string; amount: number }[] = [];
  discountTotal = 0;

  // Internal copy of the invoice to avoid mutating the input
  private internalInvoice: PreviewInvoice | undefined;

  constructor(public settings: SettingsService) {}

  ngOnChanges(): void {
    // Create a deep copy of the invoice to avoid modifying the input property directly
    this.internalInvoice = JSON.parse(JSON.stringify(this.invoice));

    if (this.internalInvoice && this.internalInvoice.lines) {
      this.internalInvoice.lines = this.internalInvoice.lines.map(line => {
        // Set default quantity if empty
        if (line.qty === null || line.qty === undefined) {
          line.qty = 1; // Default quantity
        }

        // Set specific example quantities for known items
        switch (line.description) {
          case 'Product A (Sample Item)':
            line.qty = 2; // Example value
            break;
          case 'Service B (Hourly Rate)':
            line.qty = 5; // Example value
            break;
          case 'Discounted Item C':
            line.qty = 1; // Example value
            break;
        }
        return line;
      });
    }
    this.recalc();
  }

  issueDateStr(): string {
    const d = (this.internalInvoice && this.internalInvoice.issueDate) ? this.internalInvoice.issueDate : new Date();
    return this.settings.formatDate(d as any);
  }

  dueDateStr(): string {
    const d = (this.internalInvoice && this.internalInvoice.dueDate) ? this.internalInvoice.dueDate : new Date();
    return this.settings.formatDate(d as any);
  }

  lineTotal(l: PreviewLine): number {
    const round2 = (n: number) => Math.round(n * 100) / 100;
    return round2((l.qty || 0) * (l.price || 0));
  }

  private recalc() {
    if (!this.internalInvoice) {
      return;
    }

    const round2 = (n: number) => Math.round(n * 100) / 100;
    const perTaxMap: Record<string, number> = {};
    this.subtotal = 0;
    for (const l of this.internalInvoice.lines || []) {
      const net = round2((l.qty || 0) * (l.price || 0));
      this.subtotal += net;
    }
    this.subtotal = round2(this.subtotal);
    // Global taxes against subtotal
    this.tax = 0;
    this.perTaxTotals = [];
    for (const t of this.internalInvoice.invoiceTaxes || []) {
      const rate = Number(t.ratePct) || 0;
      const amt = round2(this.subtotal * rate / 100);
      perTaxMap[t.name] = (perTaxMap[t.name] || 0) + amt;
      this.tax += amt;
      this.perTaxTotals.push({ name: t.name, ratePct: rate, amount: amt });
    }
    this.tax = round2(this.tax);
    const preDiscount = round2(this.subtotal + this.tax);
    // Discounts
    this.discountTotal = 0;
    this.perDiscountTotals = [];
    for (const d of (this.internalInvoice.invoiceDiscounts || [])) {
      const safeVal = Math.max(0, Number(d.value) || 0);
      const amt = d.type === 'percent' ? round2(preDiscount * (safeVal / 100)) : round2(safeVal);
      this.perDiscountTotals.push({ name: d.name || 'Discount', amount: amt });
      this.discountTotal += amt;
    }
    const cappedDiscount = Math.min(this.discountTotal, preDiscount);
    this.total = round2(Math.max(0, preDiscount - cappedDiscount));
    this.perTaxTotals = this.perTaxTotals.map(x => ({ ...x, amount: round2(x.amount) }));
  }

  style(key: string): {[k: string]: string} {
    const s = this.settings.settings.invoiceStyles?.[key];
    if (!s) return {};
    const css: {[k: string]: string} = {
      'font-family': s.fontFamily,
      'font-size': (s.fontSize || 12) + 'px',
      'color': s.color || '#111827',
    };
    if (s.fontWeight) css['font-weight'] = s.fontWeight;
    return css;
  }
}
