import { __decorate } from "tslib";
import { Component } from '@angular/core';
export let DashboardComponent = class DashboardComponent {
    constructor(settingsService, dataService, invoicesApi, clientsApi, currencyService, router, toast, auth, mailApi) {
        this.settingsService = settingsService;
        this.dataService = dataService;
        this.invoicesApi = invoicesApi;
        this.clientsApi = clientsApi;
        this.currencyService = currencyService;
        this.router = router;
        this.toast = toast;
        this.auth = auth;
        this.mailApi = mailApi;
        this.totalOpenAmount = 0;
        this.totalPaidAmount = 0;
        this.totalOverdueAmount = 0;
        this.overdueCount = 0;
        this.lineChartData = [];
        this.lineChartLabels = [];
        this.sortedCustomers = [];
        this.sampleInvoices = [];
        // Reminders summary
        this.scheduledThisWeek = 0;
        this.sentLast7d = 0;
    }
    ngOnInit() {
        const baseCurrency = this.settingsService.settings.currency;
        this.invoicesApi.list().subscribe(allInvoices => {
            // Overdue count
            const overdueInvoices = allInvoices.filter(i => i.status === 'OVERDUE');
            this.overdueCount = overdueInvoices.length;
            // Totals by status converted to base currency
            const sumConverted = (list) => Promise.all(list.map(inv => this.currencyService.convertCurrency(Number(inv.total) || 0, inv.currency, baseCurrency).toPromise())).then(amts => amts.reduce((a, b) => a + b, 0));
            Promise.all([
                sumConverted(allInvoices.filter(i => i.status === 'OPEN')),
                sumConverted(allInvoices.filter(i => i.status === 'COLLECTED')),
                sumConverted(allInvoices.filter(i => i.status === 'OVERDUE')),
            ]).then(([open, paid, overdue]) => {
                this.totalOpenAmount = open;
                this.totalPaidAmount = paid;
                this.totalOverdueAmount = overdue;
            });
            // Recent invoices map to UI shape
            this.sampleInvoices = allInvoices.slice(0, 5).map(i => ({
                id: i.number,
                client: i.clientName,
                amount: Number(i.subtotal) || 0,
                tax: Number(i.taxTotal) || 0,
                currency: i.currency,
                status: i.status === 'COLLECTED' ? 'paid' : (i.status === 'OVERDUE' ? 'overdue' : 'issued')
            }));
            // Collections trend (last 6 months)
            const collectedAmounts = new Array(6).fill(0);
            const monthLabels = [];
            const today = new Date();
            const collected = allInvoices.filter(i => i.status === 'COLLECTED');
            const monthPromises = [];
            for (let i = 5; i >= 0; i--) {
                const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
                const monthName = date.toLocaleString('default', { month: 'short' });
                monthLabels.push(monthName);
                const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
                const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                const monthly = collected.filter(inv => {
                    const paymentDate = new Date(inv.issueDate);
                    return paymentDate >= startOfMonth && paymentDate <= endOfMonth;
                });
                const monthIndex = 5 - i;
                monthPromises.push(sumConverted(monthly).then(total => { collectedAmounts[monthIndex] = total; }));
            }
            Promise.all(monthPromises).then(() => {
                this.lineChartData = [{ data: collectedAmounts, label: 'Collected' }];
                this.lineChartLabels = monthLabels;
            });
            // Top exposure by client (open balance in base currency)
            this.clientsApi.list({ archived: false }).subscribe(clients => {
                const items = clients.map(c => {
                    const mine = allInvoices.filter(i => i.clientId === c.id && (i.status === 'OPEN' || i.status === 'OVERDUE'));
                    return Promise.all(mine.map(i => this.currencyService.convertCurrency(Number(i.total) || 0, i.currency, baseCurrency).toPromise()))
                        .then(amts => ({ ...c, openBalance: amts.reduce((a, b) => a + b, 0) }));
                });
                Promise.all(items).then(rows => {
                    this.sortedCustomers = rows.sort((a, b) => b.openBalance - a.openBalance).slice(0, 5);
                });
            });
            // Reminders summary from backend stats
            this.mailApi.getReminderStats(7).subscribe(s => {
                this.scheduledThisWeek = s.scheduledNext7d || 0;
                this.sentLast7d = s.sentLast7d || 0;
            });
        });
    }
    getInitials(name) {
        if (!name)
            return '?';
        const parts = name.trim().split(/\s+/).filter(Boolean);
        if (parts.length === 0)
            return '?';
        const first = parts[0]?.[0] ?? '';
        const second = parts.length > 1 ? parts[1]?.[0] ?? '' : '';
        return (first + second).toUpperCase();
    }
    logout() {
        this.auth.logout().subscribe({
            next: () => { this.toast.info('Logged out'); this.router.navigateByUrl('/'); },
            error: () => { this.toast.info('Logged out'); this.router.navigateByUrl('/'); }
        });
    }
};
DashboardComponent = __decorate([
    Component({
        selector: 'app-dashboard',
        templateUrl: './dashboard.component.html',
        styleUrls: ['./dashboard.component.css']
    })
], DashboardComponent);
//# sourceMappingURL=dashboard.component.js.map