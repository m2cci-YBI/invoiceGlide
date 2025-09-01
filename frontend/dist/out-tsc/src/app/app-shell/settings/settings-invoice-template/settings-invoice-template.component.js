import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { SettingsBaseComponent } from '../settings-base.component';
export let SettingsInvoiceTemplateComponent = class SettingsInvoiceTemplateComponent extends SettingsBaseComponent {
    constructor(settingsService, toast) {
        super(settingsService, toast);
        this.settingsService = settingsService;
        this.styleKeys = [
            { key: 'headerTitle', label: 'Header title (INVOICE)' },
            { key: 'invoiceNumber', label: 'Invoice number' },
            { key: 'companyName', label: 'Company name' },
            { key: 'companyEmail', label: 'Company email' },
            { key: 'metaLabel', label: 'Meta label (Issue/Due/Bill To)' },
            { key: 'issueDateLabel', label: 'Issue Date Label' },
            { key: 'issueDateValue', label: 'Issue Date Value' },
            { key: 'dueDateLabel', label: 'Due Date Label' },
            { key: 'dueDateValue', label: 'Due Date Value' },
            { key: 'billToLabel', label: 'Bill To label' },
            { key: 'billToName', label: 'Bill To name' },
            { key: 'billToEmail', label: 'Bill To email' },
            { key: 'tableHeader', label: 'Table header' },
            { key: 'tableCell', label: 'Table cell' },
            { key: 'summaryLabel', label: 'Summary label' },
            { key: 'summaryValue', label: 'Summary value' },
            { key: 'summaryTotal', label: 'Summary total' },
            { key: 'footer', label: 'Footer' },
        ];
    }
    openPreview() {
        this.previewInvoiceData = this.generatePreviewInvoice(); // Generate only when opening
        this.showPreview = true;
    }
    generatePreviewInvoice() {
        const year = new Date().getFullYear();
        const invoiceNumber = this.settings.invoiceNumberPrefix.replace('{YYYY}', year.toString()) + this.settings.invoiceNumberCounter;
        return {
            number: invoiceNumber,
            issueDate: this.settingsService.formatDate(new Date()),
            dueDate: this.settingsService.formatDate(new Date(new Date().setDate(new Date().getDate() + 30))),
            client: { name: 'Sample Client Inc.', email: 'client@example.com', address: `123 Client Street\nClient City, CC 12345` },
            lines: [
                { description: 'Product A (Sample Item)', qty: 2, unit: 'pcs', price: 50, taxes: [0] },
                { description: 'Service B (Hourly Rate)', qty: 5, unit: 'hours', price: 75, taxes: [0] },
                { description: 'Discounted Item C', qty: 1, unit: 'pcs', price: 120, taxes: [0] }
            ],
            invoiceTaxes: this.settings.templateTaxes.length ? this.settings.templateTaxes : [{ name: 'HST', ratePct: 13 }],
            currency: this.settings.currency,
            notes: 'Thank you for your business!'
        };
    }
    saveTemplateSettings() {
        this.saveSettings();
        this.toast?.success('Invoice template saved');
    }
};
SettingsInvoiceTemplateComponent = __decorate([
    Component({
        selector: 'app-settings-invoice-template',
        templateUrl: './settings-invoice-template.component.html',
        styleUrls: ['./settings-invoice-template.component.css']
    })
], SettingsInvoiceTemplateComponent);
//# sourceMappingURL=settings-invoice-template.component.js.map