import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { INVOICE_API } from './core/invoice-api';

export interface InvoiceDto {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  total: number;
  status: 'DRAFT' | 'OPEN' | 'OVERDUE' | 'COLLECTED' | 'CANCELED';
}

@Injectable({ providedIn: 'root' })
export class InvoicesApiService {
  constructor(private http: HttpClient) {}

  list(params?: { status?: string; query?: string }): Observable<InvoiceDto[]> {
    let p = new HttpParams();
    if (params?.status) p = p.set('status', params.status);
    if (params?.query) p = p.set('query', params.query);
    return this.http.get<InvoiceDto[]>(`${INVOICE_API}/invoices`, { params: p });
  }

  get(id: string): Observable<InvoiceDto> {
    return this.http.get<InvoiceDto>(`${INVOICE_API}/invoices/${id}`);
  }

  create(body: any): Observable<InvoiceDto> {
    return this.http.post<InvoiceDto>(`${INVOICE_API}/invoices`, body);
  }

  setStatus(id: string, status: 'OPEN' | 'OVERDUE' | 'COLLECTED' | 'CANCELED') {
    return this.http.post<void>(`${INVOICE_API}/invoices/${id}/status`, { status });
  }

  downloadPdf(id: string) {
    return this.http.get(`${INVOICE_API}/invoices/${id}/pdf`, { responseType: 'blob' });
  }
}

