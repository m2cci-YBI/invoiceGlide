import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { INVOICE_API } from './core/invoice-api';
export let InvoicesApiService = class InvoicesApiService {
    constructor(http) {
        this.http = http;
    }
    list(params) {
        let p = new HttpParams();
        if (params?.status)
            p = p.set('status', params.status);
        if (params?.query)
            p = p.set('query', params.query);
        return this.http.get(`${INVOICE_API}/invoices`, { params: p });
    }
    get(id) {
        return this.http.get(`${INVOICE_API}/invoices/${id}`);
    }
    create(body) {
        return this.http.post(`${INVOICE_API}/invoices`, body);
    }
    setStatus(id, status) {
        return this.http.post(`${INVOICE_API}/invoices/${id}/status`, { status });
    }
    downloadPdf(id) {
        return this.http.get(`${INVOICE_API}/invoices/${id}/pdf`, { responseType: 'blob' });
    }
};
InvoicesApiService = __decorate([
    Injectable({ providedIn: 'root' })
], InvoicesApiService);
//# sourceMappingURL=invoices-api.service.js.map