import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { ClientsApiService, ClientDto } from '../../clients-api.service';
import { InvoicesApiService, InvoiceDto } from '../../invoices-api.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers: Array<ClientDto & { openAmount: number; paidAmount: number; overdueAmount: number } > = [];
  filteredCustomers: Array<ClientDto & { openAmount: number; paidAmount: number; overdueAmount: number } > = [];
  query = '';
  editing: any | null = null; // null=new closed; object for form
  showForm = false;

  constructor(private clientsApi: ClientsApiService, private invoicesApi: InvoicesApiService, public dataService: DataService) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    // Fetch clients and invoices, then compute per-client aggregates (by invoice status)
    this.clientsApi.list({ archived: false }).subscribe(clients => {
      this.invoicesApi.list().subscribe(invoices => {
        const enriched = clients.map(c => {
          const mine = invoices.filter(i => i.clientId === c.id);
          const sum = (list: InvoiceDto[]) => list.reduce((acc, it) => acc + (Number(it.total) || 0), 0);
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
    this.filteredCustomers = this.customers.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone ? String(c.phone).toLowerCase().includes(q) : false)
    );
  }

  openNew() {
    this.editing = { id: '', name: '', email: '', phone: '', currency: 'CAD', openAmount: 0, paidAmount: 0, overdueAmount: 0 };
    this.showForm = true;
  }

  openEdit(c: any) {
    this.editing = { ...c };
    this.showForm = true;
  }

  saveCustomer() {
    if (this.editing.id) {
      const body: Partial<ClientDto> = {
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
    } else {
      const body = {
        name: this.editing.name,
        email: this.editing.email,
        phone: this.editing.phone,
        currency: this.editing.currency || 'USD',
        region: this.editing.region || undefined,
        archived: false,
      } as Partial<ClientDto> & { name: string; email: string; currency: string };
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

}
