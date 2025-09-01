import { Injectable } from '@angular/core';
import { InvoiceService } from './invoice.service';
import { CurrencyService } from './currency.service';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private sampleCustomers = [
    { id: 'C-001', name: 'Acme Corp', email: 'billing@acme.com', phone: '555-123-4567', currency: 'USD', openBalance: 1200, archived: false, region: 'North America' },
    { id: 'C-002', name: 'Globex Inc.', email: 'accounts@globex.com', phone: '555-987-6543', currency: 'CAD', openBalance: 800, archived: false, region: 'North America' },
    { id: 'C-003', name: 'Soylent Corp', email: 'finance@soylent.com', phone: '555-555-1212', currency: 'EUR', openBalance: 300, archived: false, region: 'Europe' },
    { id: 'C-004', name: 'Initech', email: 'ap@initech.com', phone: '555-333-2222', currency: 'USD', openBalance: 0, archived: true, region: 'North America' },
    { id: 'C-005', name: 'Umbrella Corp', email: 'payments@umbrella.com', phone: '555-777-8888', currency: 'GBP', openBalance: 2500, archived: false, region: 'Europe' },
  ];

  constructor(private invoiceService: InvoiceService, private currencyService: CurrencyService) { }

  getCustomers() {
    return this.sampleCustomers.filter(c => !c.archived);
  }

  getCustomerById(id: string) {
    return this.sampleCustomers.find(c => c.id === id);
  }

  addCustomer(customer: any) {
    this.sampleCustomers.push(customer);
  }

  updateCustomer(customer: any) {
    const index = this.sampleCustomers.findIndex(c => c.id === customer.id);
    if (index > -1) {
      this.sampleCustomers[index] = customer;
    }
  }

  archiveCustomer(id: string) {
    const customer = this.getCustomerById(id);
    if (customer) {
      customer.archived = true;
    }
  }

  getCustomersWithAggregatedAmounts(baseReportingCurrency: string = 'USD'): Observable<any[]> {
    const allInvoices = this.invoiceService.getInvoices();

    const customerAggregations = this.sampleCustomers.map(customer => {
      const openAmountPromises: Promise<number>[] = [];
      const paidAmountPromises: Promise<number>[] = [];
      const overdueAmountPromises: Promise<number>[] = [];

      const customerInvoices = allInvoices.filter(invoice => invoice.client === customer.name);

      customerInvoices.forEach(invoice => {
        const totalAmount = invoice.amount + invoice.tax;
        if (invoice.status === 'paid') {
          paidAmountPromises.push(this.currencyService.convertCurrency(totalAmount, invoice.currency, baseReportingCurrency).toPromise() as Promise<number>);
        } else {
          openAmountPromises.push(this.currencyService.convertCurrency(totalAmount, invoice.currency, baseReportingCurrency).toPromise() as Promise<number>);
          if (invoice.status === 'overdue') {
            overdueAmountPromises.push(this.currencyService.convertCurrency(totalAmount, invoice.currency, baseReportingCurrency).toPromise() as Promise<number>);
          }
        }
      });

      return forkJoin({
        openAmount: Promise.all(openAmountPromises).then(amounts => amounts.reduce((sum, current) => sum + current, 0)),
        paidAmount: Promise.all(paidAmountPromises).then(amounts => amounts.reduce((sum, current) => sum + current, 0)),
        overdueAmount: Promise.all(overdueAmountPromises).then(amounts => amounts.reduce((sum, current) => sum + current, 0))
      }).pipe(
        map(convertedAmounts => ({
          ...customer,
          openAmount: convertedAmounts.openAmount,
          paidAmount: convertedAmounts.paidAmount,
          overdueAmount: convertedAmounts.overdueAmount,
        }))
      );
    });

    return forkJoin(customerAggregations);
  }
}