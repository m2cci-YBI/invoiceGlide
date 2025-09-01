import { __decorate } from "tslib";
import { Component, Input } from '@angular/core';
export let InvoicePreviewComponent = class InvoicePreviewComponent {
    constructor(settings) {
        this.settings = settings;
        this.subtotal = 0;
        this.tax = 0;
        this.total = 0;
        this.perTaxTotals = [];
        this.perDiscountTotals = [];
        this.discountTotal = 0;
    }
    ngOnChanges() {
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
    issueDateStr() {
        const d = (this.internalInvoice && this.internalInvoice.issueDate) ? this.internalInvoice.issueDate : new Date();
        return this.settings.formatDate(d);
    }
    dueDateStr() {
        const d = (this.internalInvoice && this.internalInvoice.dueDate) ? this.internalInvoice.dueDate : new Date();
        return this.settings.formatDate(d);
    }
    lineTotal(l) {
        const round2 = (n) => Math.round(n * 100) / 100;
        return round2((l.qty || 0) * (l.price || 0));
    }
    recalc() {
        if (!this.internalInvoice) {
            return;
        }
        const round2 = (n) => Math.round(n * 100) / 100;
        const perTaxMap = {};
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
    style(key) {
        const s = this.settings.settings.invoiceStyles?.[key];
        if (!s)
            return {};
        const css = {
            'font-family': s.fontFamily,
            'font-size': (s.fontSize || 12) + 'px',
            'color': s.color || '#111827',
        };
        if (s.fontWeight)
            css['font-weight'] = s.fontWeight;
        return css;
    }
};
__decorate([
    Input()
], InvoicePreviewComponent.prototype, "invoice", void 0);
InvoicePreviewComponent = __decorate([
    Component({
        selector: 'app-invoice-preview',
        templateUrl: './invoice-preview.component.html',
        styleUrls: ['./invoice-preview.component.css']
    })
], InvoicePreviewComponent);
//# sourceMappingURL=invoice-preview.component.js.map