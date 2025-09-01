import { __decorate } from "tslib";
import { Component } from '@angular/core';
export let InvoicesComponent = class InvoicesComponent {
    constructor(invoicesApi, dataService, router, settingsService) {
        this.invoicesApi = invoicesApi;
        this.dataService = dataService;
        this.router = router;
        this.settingsService = settingsService;
        this.invoices = [];
        this.filteredInvoices = [];
        this.query = '';
        this.selectedStatus = 'All statuses'; // New property
    }
    ngOnInit() {
        this.load();
    }
    load() {
        let status = undefined;
        if (this.selectedStatus !== 'All statuses') {
            status = this.selectedStatus === 'Paid' ? 'COLLECTED' : (this.selectedStatus === 'Overdue' ? 'OVERDUE' : 'OPEN');
        }
        const query = this.query?.trim() || undefined;
        this.invoicesApi.list({ status, query }).subscribe(list => {
            this.invoices = list;
            this.filteredInvoices = list;
        });
    }
    filterInvoices() {
        this.load();
    }
    openDetail(invoice) {
        this.router.navigate(['/invoices', invoice.id]);
    }
    newInvoice() {
        this.router.navigate(['/new-invoice']);
    }
    uiStatus(i) {
        switch (i.status) {
            case 'COLLECTED': return 'paid';
            case 'OVERDUE': return 'overdue';
            default: return 'issued';
        }
    }
};
InvoicesComponent = __decorate([
    Component({
        selector: 'app-invoices',
        templateUrl: './invoices.component.html',
        styleUrls: ['./invoices.component.css']
    })
], InvoicesComponent);
//# sourceMappingURL=invoices.component.js.map