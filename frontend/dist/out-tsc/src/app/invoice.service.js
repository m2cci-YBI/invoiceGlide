import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
export let InvoiceService = class InvoiceService {
    constructor() {
        this.sampleInvoices = [
            // August 2025
            { id: 'INV-2025-001', client: 'Acme Corp', issueDate: '2025-08-05', dueDate: '2025-08-19', amount: 1200, tax: 156, currency: 'USD', status: 'paid' },
            { id: 'INV-2025-002', client: 'Globex Inc.', issueDate: '2025-08-10', dueDate: '2025-09-10', amount: 800, tax: 104, currency: 'CAD', status: 'issued' },
            { id: 'INV-2025-003', client: 'Soylent Corp', issueDate: '2025-08-15', dueDate: '2025-08-29', amount: 300, tax: 39, currency: 'EUR', status: 'paid' },
            { id: 'INV-2025-016', client: 'Acme Corp', issueDate: '2025-08-01', dueDate: '2025-08-10', amount: 500, tax: 65, currency: 'USD', status: 'overdue' },
            // July 2025
            { id: 'INV-2025-004', client: 'Umbrella Corp', issueDate: '2025-07-01', dueDate: '2025-07-15', amount: 2500, tax: 325, currency: 'GBP', status: 'paid' },
            { id: 'INV-2025-005', client: 'Acme Corp', issueDate: '2025-07-10', dueDate: '2025-09-15', amount: 1500, tax: 195, currency: 'USD', status: 'issued' },
            { id: 'INV-2025-006', client: 'Globex Inc.', issueDate: '2025-07-20', dueDate: '2025-08-03', amount: 700, tax: 91, currency: 'CAD', status: 'paid' },
            { id: 'INV-2025-017', client: 'Globex Inc.', issueDate: '2025-07-05', dueDate: '2025-07-15', amount: 1000, tax: 130, currency: 'CAD', status: 'overdue' },
            // June 2025
            { id: 'INV-2025-007', client: 'Soylent Corp', issueDate: '2025-06-01', dueDate: '2025-06-15', amount: 400, tax: 52, currency: 'EUR', status: 'paid' },
            { id: 'INV-2025-008', client: 'Umbrella Corp', issueDate: '2025-06-10', dueDate: '2025-09-20', amount: 3000, tax: 390, currency: 'GBP', status: 'issued' },
            { id: 'INV-2025-009', client: 'Acme Corp', issueDate: '2025-06-20', dueDate: '2025-07-04', amount: 1000, tax: 130, currency: 'USD', status: 'paid' },
            { id: 'INV-2025-018', client: 'Soylent Corp', issueDate: '2025-06-15', dueDate: '2025-06-25', amount: 750, tax: 97.5, currency: 'EUR', status: 'overdue' },
            // May 2025
            { id: 'INV-2025-010', client: 'Globex Inc.', issueDate: '2025-05-05', dueDate: '2025-05-19', amount: 900, tax: 117, currency: 'CAD', status: 'paid' },
            { id: 'INV-2025-011', client: 'Soylent Corp', issueDate: '2025-05-15', dueDate: '2025-09-25', amount: 600, tax: 78, currency: 'EUR', status: 'issued' },
            { id: 'INV-2025-019', client: 'Globex Inc.', issueDate: '2025-05-01', dueDate: '2025-05-10', amount: 200, tax: 26, currency: 'CAD', status: 'overdue' },
            // April 2025
            { id: 'INV-2025-012', client: 'Umbrella Corp', issueDate: '2025-04-01', dueDate: '2025-04-15', amount: 2000, tax: 260, currency: 'GBP', status: 'paid' },
            { id: 'INV-2025-013', client: 'Acme Corp', issueDate: '2025-04-10', dueDate: '2025-04-24', amount: 1100, tax: 143, currency: 'USD', status: 'paid' },
            { id: 'INV-2025-020', client: 'Acme Corp', issueDate: '2025-04-05', dueDate: '2025-04-15', amount: 1500, tax: 195, currency: 'USD', status: 'overdue' },
            // March 2025
            { id: 'INV-2025-014', client: 'Globex Inc.', issueDate: '2025-03-05', dueDate: '2025-03-19', amount: 1300, tax: 169, currency: 'CAD', status: 'paid' },
            { id: 'INV-2025-015', client: 'Soylent Corp', issueDate: '2025-03-15', dueDate: '2025-03-29', amount: 500, tax: 65, currency: 'EUR', status: 'paid' },
            { id: 'INV-2025-021', client: 'Globex Inc.', issueDate: '2025-03-10', dueDate: '2025-03-20', amount: 800, tax: 104, currency: 'CAD', status: 'overdue' },
        ];
    }
    getInvoiceStatus(invoice) {
        // Respect manual override first, if present
        if (invoice.statusOverride) {
            return invoice.statusOverride;
        }
        if (invoice.status === 'paid') {
            return 'paid';
        }
        const today = new Date();
        const dueDate = new Date(invoice.dueDate);
        if (dueDate < today) {
            return 'overdue';
        }
        return 'issued';
    }
    getInvoices() {
        return this.sampleInvoices.map(invoice => ({
            ...invoice,
            status: this.getInvoiceStatus(invoice)
        }));
    }
    getInvoiceById(id) {
        const invoice = this.sampleInvoices.find(i => i.id === id);
        if (invoice) {
            return { ...invoice, status: this.getInvoiceStatus(invoice) };
        }
        return undefined;
    }
    addInvoice(invoice) {
        this.sampleInvoices.push(invoice);
    }
    updateInvoice(invoice) {
        const index = this.sampleInvoices.findIndex(i => i.id === invoice.id);
        if (index > -1) {
            this.sampleInvoices[index] = invoice;
        }
    }
    updateInvoiceStatus(id, status) {
        const idx = this.sampleInvoices.findIndex(i => i.id === id);
        if (idx === -1)
            return;
        // Store a manual override so lists and detail use the chosen status
        this.sampleInvoices[idx] = { ...this.sampleInvoices[idx], statusOverride: status };
    }
};
InvoiceService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], InvoiceService);
//# sourceMappingURL=invoice.service.js.map