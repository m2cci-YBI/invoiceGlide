import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { INVOICE_API } from './core/invoice-api';
export let ClientsApiService = class ClientsApiService {
    constructor(http) {
        this.http = http;
    }
    list(params) {
        let p = new HttpParams();
        if (params && params.archived != null)
            p = p.set('archived', String(params.archived));
        return this.http.get(`${INVOICE_API}/clients`, { params: p });
    }
    get(id) {
        return this.http.get(`${INVOICE_API}/clients/${id}`);
    }
    create(body) {
        return this.http.post(`${INVOICE_API}/clients`, body);
    }
    update(id, body) {
        return this.http.put(`${INVOICE_API}/clients/${id}`, body);
    }
};
ClientsApiService = __decorate([
    Injectable({ providedIn: 'root' })
], ClientsApiService);
//# sourceMappingURL=clients-api.service.js.map