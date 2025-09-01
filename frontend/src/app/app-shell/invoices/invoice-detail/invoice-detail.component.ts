import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { SettingsService } from 'src/app/settings.service';
import { InvoicesApiService, InvoiceDto } from 'src/app/invoices-api.service';
import { MailApiService } from 'src/app/mail-api.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.css']
})
export class InvoiceDetailComponent implements OnInit {
  invoice?: InvoiceDto;
  selectedStatus: 'issued' | 'paid' | 'overdue' = 'issued';
  timeline: { text: string; type: 'default'|'success'|'info' }[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dataService: DataService,
    public settingsService: SettingsService,
    private invoicesApi: InvoicesApiService,
    private mailApi: MailApiService,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
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

  goBack(): void {
    this.router.navigate(['/invoices']);
  }

  onStatusChange(ev: Event) {
    const val = (ev.target as HTMLSelectElement).value as 'issued'|'paid'|'overdue';
    this.selectedStatus = val;
    if (this.invoice) {
      const apiStatus = val === 'paid' ? 'COLLECTED' : (val === 'overdue' ? 'OVERDUE' : 'OPEN');
      this.invoicesApi.setStatus(this.invoice.id, apiStatus as any).subscribe();
      this.invoice = { ...(this.invoice as any), status: apiStatus };
      const label = ` ${this.formatDateTime(new Date())} Status changed to ${apiStatus}`;
      this.timeline.unshift({ text: label, type: val === 'paid' ? 'success' : 'info' });
    }
  }

  togglePaidStatus() {
    if (!this.invoice) return;
    let next: 'paid'|'issued'|'overdue';
    if (this.invoice.status === 'COLLECTED') {
      const today = new Date();
      const due = new Date(this.invoice.dueDate as any);
      next = due < today ? 'overdue' : 'issued';
    } else {
      next = 'paid';
    }
    this.selectedStatus = next;
    const apiStatus = next === 'paid' ? 'COLLECTED' : (next === 'overdue' ? 'OVERDUE' : 'OPEN');
    this.invoicesApi.setStatus(this.invoice.id, apiStatus as any).subscribe();
    this.invoice = { ...(this.invoice as any), status: apiStatus };
    const label = ` ${this.formatDateTime(new Date())} ${next === 'paid' ? 'Marked as PAID' : 'Unmarked as PAID → ' + apiStatus}`;
    this.timeline.unshift({ text: label, type: next === 'paid' ? 'success' : 'info' });
  }

  private buildTimeline() {
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

  private pad(n: number) { return n.toString().padStart(2, '0'); }
  private formatDateTime(d: Date) {
    const yyyy = d.getFullYear();
    const mm = this.pad(d.getMonth()+1);
    const dd = this.pad(d.getDate());
    const hh = this.pad(d.getHours());
    const mi = this.pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
  }

  uiStatus(inv: InvoiceDto): 'issued'|'paid'|'overdue' {
    switch (inv.status) {
      case 'COLLECTED': return 'paid';
      case 'OVERDUE': return 'overdue';
      default: return 'issued';
    }
  }

  downloadPdf() {
    if (!this.invoice) return;
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
    if (!this.invoice) return;
    this.mailApi.sendInvoice(this.invoice.id).subscribe({
      next: () => this.toast?.success('Email sent'),
      error: () => this.toast?.error('Failed to send email')
    });
  }

  remindNow() {
    if (!this.invoice) return;
    this.mailApi.sendReminder(this.invoice.id).subscribe({
      next: () => this.toast?.success('Reminder sent'),
      error: () => this.toast?.error('Failed to send reminder')
    });
  }
}
