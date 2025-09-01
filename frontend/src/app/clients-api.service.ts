import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { INVOICE_API } from './core/invoice-api';

export interface ClientDto {
  id: string;
  name: string;
  email: string;
  phone?: string;
  currency: string;
  region?: string;
  address?: string;
  archived?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ClientsApiService {
  constructor(private http: HttpClient) {}

  list(params?: { archived?: boolean }): Observable<ClientDto[]> {
    let p = new HttpParams();
    if (params && params.archived != null) p = p.set('archived', String(params.archived));
    return this.http.get<ClientDto[]>(`${INVOICE_API}/clients`, { params: p });
  }

  get(id: string): Observable<ClientDto> {
    return this.http.get<ClientDto>(`${INVOICE_API}/clients/${id}`);
  }

  create(body: Partial<ClientDto> & { name: string; email: string; currency: string }): Observable<ClientDto> {
    return this.http.post<ClientDto>(`${INVOICE_API}/clients`, body);
  }

  update(id: string, body: Partial<ClientDto>): Observable<ClientDto> {
    return this.http.put<ClientDto>(`${INVOICE_API}/clients/${id}`, body);
  }
}
