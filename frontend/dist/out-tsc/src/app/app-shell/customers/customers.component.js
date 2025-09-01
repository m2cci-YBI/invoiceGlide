import { __decorate } from "tslib";
import { Component } from '@angular/core';
export let CustomersComponent = class CustomersComponent {
    constructor(clientsApi, invoicesApi, dataService) {
        this.clientsApi = clientsApi;
        this.invoicesApi = invoicesApi;
        this.dataService = dataService;
        this.customers = [];
        this.filteredCustomers = [];
        this.query = '';
        this.editing = null; // null=new closed; object for form
        this.showForm = false;
    }
    ngOnInit() {
        this.loadCustomers();
    }
    loadCustomers() {
        // Fetch clients and invoices, then compute per-client aggregates (by invoice status)
        this.clientsApi.list({ archived: false }).subscribe(clients => {
            this.invoicesApi.list().subscribe(invoices => {
                const enriched = clients.map(c => {
                    const mine = invoices.filter(i => i.clientId === c.id);
                    const sum = (list) => list.reduce((acc, it) => acc + (Number(it.total) || 0), 0);
                    const openAmount = sum(mine.filter(i => i.status === 'OPEN'));
                    const paidAmount = sum(mine.filter(i => i.status === 'COLLECTED'));
                    const overdueAmount = sum(mine.filter(i => i.status === 'OVERDUE'));
                    return { ...c, openAmount, paidAmount, overdueAmount };
                });
                this.customers = enriched;
                this.filterCustomers();
            });
        });
    }
    filterCustomers() {
        const q = this.query.toLowerCase();
        this.filteredCustomers = this.customers.filter(c => c.name.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            (c.phone ? String(c.phone).toLowerCase().includes(q) : false));
    }
    openNew() {
        this.editing = { id: '', name: '', email: '', phone: '', currency: 'CAD', openAmount: 0, paidAmount: 0, overdueAmount: 0 };
        this.showForm = true;
    }
    openEdit(c) {
        this.editing = { ...c };
        this.showForm = true;
    }
    saveCustomer() {
        if (this.editing.id) {
            const body = {
                name: this.editing.name,
                email: this.editing.email,
                phone: this.editing.phone,
                currency: this.editing.currency,
                region: this.editing.region,
                archived: !!this.editing.archived,
            };
            this.clientsApi.update(this.editing.id, body).subscribe({
                next: () => { this.showForm = false; this.loadCustomers(); },
                error: () => { this.showForm = false; }
            });
        }
        else {
            const body = {
                name: this.editing.name,
                email: this.editing.email,
                phone: this.editing.phone,
                currency: this.editing.currency || 'USD',
                region: this.editing.region || undefined,
                archived: false,
            };
            this.clientsApi.create(body).subscribe({
                next: () => { this.showForm = false; this.loadCustomers(); },
                error: () => { this.showForm = false; }
            });
        }
    }
    // Archive removed
    cancelForm() {
        this.showForm = false;
    }
};
CustomersComponent = __decorate([
    Component({
        selector: 'app-customers',
        templateUrl: './customers.component.html',
        styleUrls: ['./customers.component.css']
    })
], CustomersComponent);
//# sourceMappingURL=customers.component.js.map