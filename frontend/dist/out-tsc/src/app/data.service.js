import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
export let DataService = class DataService {
    constructor(settings) {
        this.settings = settings;
    }
    currency(n, code) {
        return this.settings.formatCurrency(n, code);
    }
};
DataService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], DataService);
//# sourceMappingURL=data.service.js.map