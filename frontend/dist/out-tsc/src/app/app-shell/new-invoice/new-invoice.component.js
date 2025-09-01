import { __decorate } from "tslib";
import { Component } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
export let NewInvoiceComponent = class NewInvoiceComponent {
    constructor(router, dataService, settingsService, invoicesApi, clientsApi, mailApi, toast) {
        this.router = router;
        this.dataService = dataService;
        this.settingsService = settingsService;
        this.invoicesApi = invoicesApi;
        this.clientsApi = clientsApi;
        this.mailApi = mailApi;
        this.toast = toast;
        this.lines = [
            { description: 'Consulting – August', qty: 8, unit: 'hours', price: 150 },
        ];
        this.invoiceTaxes = [
            { name: 'HST', ratePct: 13 },
        ];
        this.subtotal = 0;
        this.tax = 0;
        this.perTaxTotals = [];
        this.total = 0;
        this.issueDate = '';
        this.dueDate = '';
        this.invoiceCurrency = '';
        this.invoiceDiscounts = [];
        this.perDiscountTotals = [];
        this.discountTotal = 0;
        this.draftKey = 'draft_invoice';
        this.lastDeleted = null;
        this.showPreview = false;
        // Cached preview data to avoid expensive recomputation on every CD tick
        this.previewInvoiceData = null;
        this.customers = [];
        this.filteredCustomers = [];
        this.clientSearchTerm = '';
        this.selectedClient = null;
        this.currencyMismatch = false;
    }
    ngOnInit() {
        this.clientsApi.list().subscribe(clis => {
            this.customers = clis.filter(c => !c.archived);
            this.filteredCustomers = this.customers;
            try {
                const saved = localStorage.getItem(this.draftKey);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    const selId = parsed?.selectedClientId;
                    if (selId)
                        this.selectedClient = this.customers.find(c => c.id === selId) || null;
                }
            }
            catch { }
        });
        const saved = localStorage.getItem(this.draftKey);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.lines)
                    this.lines = parsed.lines;
                if (parsed.invoiceTaxes)
                    this.invoiceTaxes = parsed.invoiceTaxes;
                if (parsed.issueDate)
                    this.issueDate = parsed.issueDate;
                if (parsed.dueDate)
                    this.dueDate = parsed.dueDate;
                if (parsed.invoiceCurrency)
                    this.invoiceCurrency = parsed.invoiceCurrency;
                if (Array.isArray(parsed.invoiceDiscounts))
                    this.invoiceDiscounts = parsed.invoiceDiscounts;
            }
            catch { }
        }
        if (!this.issueDate) {
            this.issueDate = new Date().toISOString().split('T')[0];
        }
        if (!this.invoiceCurrency) {
            this.invoiceCurrency = this.settingsService.settings.currency;
        }
        if (!this.invoiceTaxes || this.invoiceTaxes.length === 0) {
            this.invoiceTaxes = (this.settingsService.settings.templateTaxes || []).map(t => ({ ...t }));
        }
        if (!this.invoiceDiscounts || this.invoiceDiscounts.length === 0) {
            this.invoiceDiscounts = (this.settingsService.settings.templateDiscounts || []).map(d => ({ ...d }));
        }
        this.calculateTotals();
        this.updatePreviewInvoice();
    }
    filterClients() {
        const term = (this.clientSearchTerm || '').toLowerCase();
        this.filteredCustomers = this.customers.filter(c => (c.name || '').toLowerCase().includes(term) || (c.email || '').toLowerCase().includes(term));
    }
    onClientSelected(event) {
        const clientId = event?.target?.value;
        this.selectedClient = this.customers.find(c => c.id === clientId) || null;
        if (this.selectedClient) {
            this.invoiceCurrency = this.selectedClient.currency;
        }
        this.checkCurrencyMismatch();
        this.persistDraft();
        this.updatePreviewInvoice();
    }
    checkCurrencyMismatch() {
        if (this.selectedClient && this.invoiceCurrency !== this.selectedClient.currency) {
            this.currencyMismatch = true;
        }
        else {
            this.currencyMismatch = false;
        }
    }
    calculateTotals() {
        const round2 = (n) => Math.round(n * 100) / 100;
        this.subtotal = 0;
        this.tax = 0;
        for (const l of this.lines) {
            const lineNet = round2((Number(l.qty) || 0) * (Number(l.price) || 0));
            this.subtotal += lineNet;
        }
        this.tax = 0;
        this.perTaxTotals = [];
        for (const t of this.invoiceTaxes) {
            const rate = Number(t.ratePct) || 0;
            const taxAmt = round2(this.subtotal * rate / 100);
            this.tax += taxAmt;
            this.perTaxTotals.push({ name: t.name, ratePct: rate, amount: taxAmt });
        }
        this.subtotal = round2(this.subtotal);
        this.tax = round2(this.tax);
        const preDiscount = round2(this.subtotal + this.tax);
        this.discountTotal = 0;
        this.perDiscountTotals = [];
        for (const d of this.invoiceDiscounts) {
            const safeVal = Math.max(0, Number(d.value) || 0);
            const amt = d.type === 'percent' ? round2(preDiscount * (safeVal / 100)) : round2(safeVal);
            this.perDiscountTotals.push({ name: d.name || 'Discount', amount: amt });
            this.discountTotal += amt;
        }
        const cappedDiscount = Math.min(this.discountTotal, preDiscount);
        this.total = round2(Math.max(0, preDiscount - cappedDiscount));
        this.perTaxTotals = this.perTaxTotals.map(x => ({ ...x, amount: round2(x.amount) }));
        this.checkCurrencyMismatch();
        this.updatePreviewInvoice();
    }
    addLine() {
        this.lines.push({ description: '', qty: 1, unit: '', price: 0 });
        this.calculateTotals();
        this.persistDraft();
    }
    updateLine(index, patch) {
        Object.assign(this.lines[index], patch);
        this.calculateTotals();
        this.persistDraft();
    }
    addInvoiceTax() {
        this.invoiceTaxes.push({ name: 'New tax', ratePct: 0 });
        this.calculateTotals();
        this.persistDraft();
    }
    removeInvoiceTax(idx) {
        this.invoiceTaxes.splice(idx, 1);
        this.calculateTotals();
        this.persistDraft();
    }
    deleteLine(idx) {
        const removed = this.lines.splice(idx, 1)[0];
        this.lastDeleted = { idx, line: removed };
        this.calculateTotals();
        this.persistDraft();
    }
    undoDelete() {
        if (!this.lastDeleted)
            return;
        this.lines.splice(this.lastDeleted.idx, 0, this.lastDeleted.line);
        this.lastDeleted = null;
        this.calculateTotals();
        this.persistDraft();
    }
    persistDraft() {
        try {
            localStorage.setItem(this.draftKey, JSON.stringify({
                lines: this.lines,
                invoiceTaxes: this.invoiceTaxes,
                issueDate: this.issueDate,
                dueDate: this.dueDate,
                invoiceCurrency: this.invoiceCurrency,
                invoiceDiscounts: this.invoiceDiscounts,
                selectedClientId: this.selectedClient ? this.selectedClient.id : null,
            }));
        }
        catch { }
    }
    openPreview() { this.showPreview = true; }
    closePreview() { this.showPreview = false; }
    updatePreviewInvoice() {
        const year = new Date().getFullYear();
        const number = this.settingsService.settings.invoiceNumberPrefix.replace('{YYYY}', String(year)) + this.settingsService.settings.invoiceNumberCounter;
        this.previewInvoiceData = {
            number,
            issueDate: this.issueDate,
            dueDate: this.dueDate,
            client: this.selectedClient ? { name: this.selectedClient.name, email: this.selectedClient.email } : { name: '—' },
            lines: this.lines.map((l) => ({ description: l.description, qty: l.qty, unit: l.unit, price: l.price })),
            invoiceTaxes: this.invoiceTaxes,
            invoiceDiscounts: this.invoiceDiscounts,
            currency: this.invoiceCurrency,
        };
    }
    lineTotal(l) {
        const round2 = (n) => Math.round(n * 100) / 100;
        return round2((Number(l.qty) || 0) * (Number(l.price) || 0));
    }
    onDone() {
        this.router.navigate(['/invoices']);
    }
    addInvoiceDiscount() {
        this.invoiceDiscounts.push({ name: 'Discount', type: 'percent', value: 0 });
        this.calculateTotals();
        this.persistDraft();
    }
    removeInvoiceDiscount(idx) {
        this.invoiceDiscounts.splice(idx, 1);
        this.calculateTotals();
        this.persistDraft();
    }
    resetFromTemplate() {
        this.invoiceTaxes = (this.settingsService.settings.templateTaxes || []).map(t => ({ ...t }));
        this.invoiceDiscounts = (this.settingsService.settings.templateDiscounts || []).map(d => ({ ...d }));
        this.calculateTotals();
        this.persistDraft();
    }
    saveInvoice() {
        if (!this.selectedClient) {
            this.toast.error('Please select a client.');
            return;
        }
        if (this.currencyMismatch) {
            this.toast.error('Currency mismatch: Invoice currency does not match client currency.');
            return;
        }
        const body = {
            clientId: this.selectedClient.id,
            issueDate: this.issueDate,
            dueDate: this.dueDate || this.issueDate,
            currency: this.invoiceCurrency,
            lines: this.lines.map((l) => ({ description: l.description, qty: Number(l.qty) || 0, unit: l.unit || '', unitPrice: Number(l.price) || 0 })),
            invoiceTaxes: this.invoiceTaxes.map(t => ({ name: t.name, ratePct: Number(t.ratePct) || 0 })),
            invoiceDiscounts: this.invoiceDiscounts.map(d => ({ name: d.name, type: d.type, value: Number(d.value) || 0 }))
        };
        this.invoicesApi.create(body).subscribe({
            next: () => { try {
                localStorage.removeItem(this.draftKey);
            }
            catch { } this.toast.success('Invoice issued'); this.router.navigate(['/dashboard']); },
            error: () => this.toast.error('Failed to create invoice')
        });
    }
    downloadInvoice() {
        if (!this.selectedClient) {
            alert('Please select a client first.');
            return;
        }
        const currency = this.invoiceCurrency || this.settingsService.settings.currency;
        const linesHtml = this.lines.map((l) => `
      <tr>
        <td>${this.escapeHtml(l.description || '')}</td>
        <td style="text-align:right">${l.qty || 0}</td>
        <td>${l.unit || ''}</td>
        <td style=\"text-align:right\">${this.settingsService.formatCurrency(l.price || 0, currency)}</td>
        <td style=\"text-align:right\">${this.settingsService.formatCurrency(this.lineTotal(l), currency)}</td>
      </tr>`).join('');
        const taxesHtml = this.perTaxTotals.map(t => `
      <div class=\"row\"><span>${this.escapeHtml(t.name)} (${t.ratePct}%)</span><span>${this.settingsService.formatCurrency(t.amount, currency)}</span></div>
    `).join('');
        const discountsHtml = this.perDiscountTotals.map((d, di) => {
            const src = this.invoiceDiscounts[di];
            const label = src && src.type === 'percent'
                ? `${this.escapeHtml(d.name)} (${Number(src.value) || 0}%)`
                : `${this.escapeHtml(d.name)} (${this.settingsService.formatCurrency(Number(src?.value) || 0, currency)})`;
            return `
      <div class=\"row discount\"><span>${label}</span><span>-${this.settingsService.formatCurrency(d.amount, currency)}</span></div>`;
        }).join('');
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '-10000px';
        container.style.top = '0';
        container.style.width = '794px';
        container.innerHTML = `
      <style>
        body{font-family:system-ui, Arial, sans-serif; color:#111827;}
        .container{max-width:800px; margin:24px auto;}
        .header{display:flex; justify-content:space-between; align-items:flex-start;}
        .logo{height:40px; width:40px; border-radius:8px; object-fit:cover; border:1px solid #e5e7eb}
        table{width:100%; border-collapse:collapse;}
        th, td{padding:8px; border-bottom:1px solid #e5e7eb; font-size:14px}
        th{text-align:left; color:#6b7280}
        .right{ text-align:right }
        .summary{ margin-top:12px; border:1px solid #e5e7eb; border-radius:12px; padding:12px; width:320px; margin-left:auto; }
        .summary .row{ display:flex; justify-content:space-between; font-size:14px; margin:2px 0 }
        .summary .discount, .summary .discount-total{ color:#b91c1c; }
        .footer{ margin-top:16px; font-size:12px; color:#6b7280; white-space:pre-wrap; }
      </style>
      <div class=\"container\">
        <div class=\"header\">
          <div style=\"display:flex;gap:12px;align-items:center\">
            ${this.settingsService.settings.logoDataUrl ? `<img class=\"logo\" src=\"${this.settingsService.settings.logoDataUrl}\" />` : `<div class=\"logo\" style=\"background:#e5e7eb\"></div>`}
            <div>
              <div style=\"font-weight:600\">${this.escapeHtml(this.settingsService.settings.legalName || 'Your Company')}</div>
              <div style=\"color:#6b7280; font-size:12px\">${this.escapeHtml(this.settingsService.settings.supportEmail || '')}</div>
            </div>
          </div>
          <div style=\"text-align:right\">
            <div style=\"letter-spacing:.1em; font-weight:600\">INVOICE</div>
            <div style=\"font-weight:600\">${this.escapeHtml(this.settingsService.settings.invoiceNumberPrefix.replace('{YYYY}', String(new Date().getFullYear())) + this.settingsService.settings.invoiceNumberCounter)}</div>
          </div>
        </div>
        <div style=\"display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:12px; font-size:14px\">
          <div>
            <div style=\"color:#6b7280\">Issue date</div>
            <div>${this.settingsService.formatDate(this.issueDate)}</div>
          </div>
          <div>
            <div style=\"color:#6b7280\">Due date</div>
            <div>${this.dueDate || this.settingsService.formatDate(new Date())}</div>
          </div>
          <div style=\"grid-column:1 / -1\">
            <div style=\"color:#6b7280\">Bill To</div>
            <div style=\"font-weight:500\">${this.escapeHtml(this.selectedClient?.name || '')}</div>
            <div style=\"color:#6b7280; font-size:12px\">${this.escapeHtml(this.selectedClient?.email || '')}</div>
          </div>
        </div>
        <div style=\"margin-top:16px; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden\">
          <table>
            <thead>
              <tr><th style=\"width:40%\">Description</th><th class=\"right\">Qty</th><th>Unit</th><th class=\"right\">Unit Price</th><th class=\"right\">Line Total</th></tr>
            </thead>
            <tbody>
              ${linesHtml}
            </tbody>
          </table>
        </div>
        <div class=\"summary\">
          <div class=\"row\"><span>Subtotal</span><span>${this.settingsService.formatCurrency(this.subtotal, currency)}</span></div>
          ${taxesHtml}
          <div class=\"row\"><span>Tax</span><span>${this.settingsService.formatCurrency(this.tax, currency)}</span></div>
          ${discountsHtml}
          ${this.discountTotal > 0 ? `<div class=\"row discount-total\"><span>Discounts total</span><span>-${this.settingsService.formatCurrency(this.discountTotal, currency)}</span></div>` : ''}
          <div class=\"row\" style=\"font-weight:600\"><span>Total</span><span>${this.settingsService.formatCurrency(this.total, currency)}</span></div>
        </div>
        <div class=\"footer\">${this.escapeHtml(this.settingsService.settings.legalFooter || '')}</div>
      </div>`;
        document.body.appendChild(container);
        const filename = `Invoice-${this.settingsService.settings.invoiceNumberPrefix.replace('{YYYY}', String(new Date().getFullYear()))}${this.settingsService.settings.invoiceNumberCounter}.pdf`;
        const pdf = new jsPDF('p', 'pt', 'a4');
        const margin = 20;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const baseWidthPx = container.scrollWidth || 794;
        const targetWidthPx = 1240;
        const renderScale = Math.min(1.6, Math.max(1, targetWidthPx / baseWidthPx));
        html2canvas(container, { scale: renderScale, useCORS: true, backgroundColor: '#ffffff', windowWidth: container.scrollWidth, windowHeight: container.scrollHeight })
            .then(canvas => {
            const cw = canvas.width;
            const ch = canvas.height;
            const maxW = pageWidth - margin * 2;
            const maxH = pageHeight - margin * 2;
            const scale = Math.min(maxW / cw, maxH / ch);
            const drawW = cw * scale;
            const drawH = ch * scale;
            const imgData = canvas.toDataURL('image/jpeg', 0.82);
            pdf.addImage(imgData, 'JPEG', margin, margin, drawW, drawH);
            pdf.save(filename);
        })
            .finally(() => {
            if (container.parentNode)
                container.parentNode.removeChild(container);
        });
    }
    escapeHtml(s) {
        return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/'/g, '&#039;');
    }
    issueAndSend() {
        if (!this.selectedClient) {
            this.toast.error('Please select a client.');
            return;
        }
        if (this.currencyMismatch) {
            this.toast.error('Currency mismatch: Invoice currency does not match client currency.');
            return;
        }
        const body = {
            clientId: this.selectedClient.id,
            issueDate: this.issueDate,
            dueDate: this.dueDate || this.issueDate,
            currency: this.invoiceCurrency,
            lines: this.lines.map((l) => ({ description: l.description, qty: Number(l.qty) || 0, unit: l.unit || '', unitPrice: Number(l.price) || 0 })),
            invoiceTaxes: this.invoiceTaxes.map(t => ({ name: t.name, ratePct: Number(t.ratePct) || 0 })),
            invoiceDiscounts: this.invoiceDiscounts.map(d => ({ name: d.name, type: d.type, value: Number(d.value) || 0 }))
        };
        this.invoicesApi.create(body).subscribe({
            next: (inv) => {
                try {
                    localStorage.removeItem(this.draftKey);
                }
                catch { }
                this.mailApi.sendInvoice(inv.id).subscribe({
                    next: () => { this.toast.success('Invoice issued and email sent'); this.router.navigate(['/dashboard']); },
                    error: () => { this.toast.error('Invoice created, but failed to send email'); this.router.navigate(['/dashboard']); }
                });
            },
            error: () => this.toast.error('Failed to create invoice')
        });
    }
};
NewInvoiceComponent = __decorate([
    Component({
        selector: 'app-new-invoice',
        templateUrl: './new-invoice.component.html',
        styleUrls: ['./new-invoice.component.css']
    })
], NewInvoiceComponent);
//# sourceMappingURL=new-invoice.component.js.map