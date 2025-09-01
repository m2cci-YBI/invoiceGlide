import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '../../settings.service';
import { DataService } from '../../data.service';
import { InvoicesApiService, InvoiceDto } from '../../invoices-api.service';
import { ClientsApiService, ClientDto } from '../../clients-api.service';
import { CurrencyService } from '../../currency.service';
import { ToastService } from 'src/app/shared/toast.service';
import { AuthService } from 'src/app/auth/auth.service';
import { MailApiService } from 'src/app/mail-api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalOpenAmount: number = 0;
  totalPaidAmount: number = 0;
  totalOverdueAmount: number = 0;
  overdueCount: number = 0;
  lineChartData: any[] = [];
  lineChartLabels: string[] = [];
  sortedCustomers: Array<ClientDto & { openBalance: number }> = [];
  sampleInvoices: any[] = [];
  // Reminders summary
  scheduledThisWeek = 0;
  sentLast7d = 0;

  constructor(
    private settingsService: SettingsService,
    public dataService: DataService,
    private invoicesApi: InvoicesApiService,
    private clientsApi: ClientsApiService,
    private currencyService: CurrencyService,
    private router: Router,
    private toast: ToastService,
    private auth: AuthService,
    private mailApi: MailApiService,
  ) { }

  ngOnInit(): void {
    const baseCurrency = this.settingsService.settings.currency;

    this.invoicesApi.list().subscribe(allInvoices => {
      // Overdue count
      const overdueInvoices = allInvoices.filter(i => i.status === 'OVERDUE');
      this.overdueCount = overdueInvoices.length;

      // Totals by status converted to base currency
      const sumConverted = (list: InvoiceDto[]) => Promise.all(
        list.map(inv => this.currencyService.convertCurrency(Number(inv.total) || 0, inv.currency, baseCurrency).toPromise() as Promise<number>)
      ).then(amts => amts.reduce((a, b) => a + b, 0));

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
      const collectedAmounts: number[] = new Array(6).fill(0);
      const monthLabels: string[] = [];
      const today = new Date();
      const collected = allInvoices.filter(i => i.status === 'COLLECTED');
      const monthPromises: Promise<void>[] = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthName = date.toLocaleString('default', { month: 'short' });
        monthLabels.push(monthName);
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const monthly = collected.filter(inv => {
          const paymentDate = new Date(inv.issueDate as any);
          return paymentDate >= startOfMonth && paymentDate <= endOfMonth;
        });
        const monthIndex = 5 - i;
        monthPromises.push(
          sumConverted(monthly).then(total => { collectedAmounts[monthIndex] = total; })
        );
      }
      Promise.all(monthPromises).then(() => {
        this.lineChartData = [{ data: collectedAmounts, label: 'Collected' }];
        this.lineChartLabels = monthLabels;
      });

      // Top exposure by client (open balance in base currency)
      this.clientsApi.list({ archived: false }).subscribe(clients => {
        const items = clients.map(c => {
          const mine = allInvoices.filter(i => i.clientId === c.id && (i.status === 'OPEN' || i.status === 'OVERDUE'));
          return Promise.all(mine.map(i => this.currencyService.convertCurrency(Number(i.total) || 0, i.currency, baseCurrency).toPromise() as Promise<number>))
            .then(amts => ({ ...c, openBalance: amts.reduce((a,b)=>a+b, 0) }));
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

  getInitials(name: string | undefined | null): string {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
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
}
