import { __decorate } from "tslib";
import { Component } from '@angular/core';
export let InvoiceDetailComponent = class InvoiceDetailComponent {
    constructor(route, router, dataService, settingsService, invoicesApi, mailApi, toast) {
        this.route = route;
        this.router = router;
        this.dataService = dataService;
        this.settingsService = settingsService;
        this.invoicesApi = invoicesApi;
        this.mailApi = mailApi;
        this.toast = toast;
        this.selectedStatus = 'issued';
        this.timeline = [];
    }
    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.invoicesApi.get(id).subscribe(inv => {
                    this.invoice = inv;
                    this.selectedStatus = this.uiStatus(inv);
                    this.buildTimeline();
                });
            }
        });
    }
    goBack() {
        this.router.navigate(['/invoices']);
    }
    onStatusChange(ev) {
        const val = ev.target.value;
        this.selectedStatus = val;
        if (this.invoice) {
            const apiStatus = val === 'paid' ? 'COLLECTED' : (val === 'overdue' ? 'OVERDUE' : 'OPEN');
            this.invoicesApi.setStatus(this.invoice.id, apiStatus).subscribe();
            this.invoice = { ...this.invoice, status: apiStatus };
            const label = ` ${this.formatDateTime(new Date())} Status changed to ${apiStatus}`;
            this.timeline.unshift({ text: label, type: val === 'paid' ? 'success' : 'info' });
        }
    }
    togglePaidStatus() {
        if (!this.invoice)
            return;
        let next;
        if (this.invoice.status === 'COLLECTED') {
            const today = new Date();
            const due = new Date(this.invoice.dueDate);
            next = due < today ? 'overdue' : 'issued';
        }
        else {
            next = 'paid';
        }
        this.selectedStatus = next;
        const apiStatus = next === 'paid' ? 'COLLECTED' : (next === 'overdue' ? 'OVERDUE' : 'OPEN');
        this.invoicesApi.setStatus(this.invoice.id, apiStatus).subscribe();
        this.invoice = { ...this.invoice, status: apiStatus };
        const label = ` ${this.formatDateTime(new Date())} ${next === 'paid' ? 'Marked as PAID' : 'Unmarked as PAID → ' + apiStatus}`;
        this.timeline.unshift({ text: label, type: next === 'paid' ? 'success' : 'info' });
    }
    buildTimeline() {
        this.timeline = [];
        if (this.invoice?.issueDate) {
            this.timeline.push({ text: `${this.invoice.issueDate} 09:00 Issued`, type: 'default' });
            this.timeline.push({ text: `${this.invoice.issueDate} 09:01 Email sent to billing@`, type: 'default' });
        }
        if (this.invoice?.status === 'COLLECTED') {
            this.timeline.push({ text: `${this.invoice.issueDate} 10:02 Payment succeeded`, type: 'success' });
            this.timeline.push({ text: `${this.invoice.issueDate} 10:03 Receipt sent`, type: 'default' });
        }
    }
    pad(n) { return n.toString().padStart(2, '0'); }
    formatDateTime(d) {
        const yyyy = d.getFullYear();
        const mm = this.pad(d.getMonth() + 1);
        const dd = this.pad(d.getDate());
        const hh = this.pad(d.getHours());
        const mi = this.pad(d.getMinutes());
        return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
    }
    uiStatus(inv) {
        switch (inv.status) {
            case 'COLLECTED': return 'paid';
            case 'OVERDUE': return 'overdue';
            default: return 'issued';
        }
    }
    downloadPdf() {
        if (!this.invoice)
            return;
        this.invoicesApi.downloadPdf(this.invoice.id).subscribe(b => {
            const url = URL.createObjectURL(b);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice-${this.invoice?.number}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
        });
    }
    send() {
        if (!this.invoice)
            return;
        this.mailApi.sendInvoice(this.invoice.id).subscribe({
            next: () => this.toast?.success('Email sent'),
            error: () => this.toast?.error('Failed to send email')
        });
    }
    remindNow() {
        if (!this.invoice)
            return;
        this.mailApi.sendReminder(this.invoice.id).subscribe({
            next: () => this.toast?.success('Reminder sent'),
            error: () => this.toast?.error('Failed to send reminder')
        });
    }
};
InvoiceDetailComponent = __decorate([
    Component({
        selector: 'app-invoice-detail',
        templateUrl: './invoice-detail.component.html',
        styleUrls: ['./invoice-detail.component.css']
    })
], InvoiceDetailComponent);
//# sourceMappingURL=invoice-detail.component.js.map