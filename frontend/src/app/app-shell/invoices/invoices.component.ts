import { Component, OnInit } from '@angular/core';
import { InvoicesApiService, InvoiceDto } from '../../invoices-api.service';
import { DataService } from '../../data.service';
import { SettingsService } from '../../settings.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit {
  invoices: InvoiceDto[] = [];
  filteredInvoices: InvoiceDto[] = [];
  query = '';
  selectedStatus = 'All statuses'; // New property

  constructor(private invoicesApi: InvoicesApiService, public dataService: DataService, private router: Router, public settingsService: SettingsService) {}

  ngOnInit(): void {
    this.load();
  }

  private load() {
    let status: string | undefined = undefined;
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

  openDetail(invoice: any) {
    this.router.navigate(['/invoices', invoice.id]);
  }

  newInvoice() {
    this.router.navigate(['/new-invoice']);
  }

  uiStatus(i: InvoiceDto): 'issued'|'paid'|'overdue' {
    switch (i.status) {
      case 'COLLECTED': return 'paid';
      case 'OVERDUE': return 'overdue';
      default: return 'issued';
    }
  }

}
