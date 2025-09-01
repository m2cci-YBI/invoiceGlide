import { __decorate } from "tslib";
import { Component, EventEmitter, Output } from '@angular/core';
export let InvoicePreviewModalComponent = class InvoicePreviewModalComponent {
    constructor() {
        this.close = new EventEmitter();
    }
};
__decorate([
    Output()
], InvoicePreviewModalComponent.prototype, "close", void 0);
InvoicePreviewModalComponent = __decorate([
    Component({
        selector: 'app-invoice-preview-modal',
        templateUrl: './invoice-preview-modal.component.html',
        styleUrls: ['./invoice-preview-modal.component.css']
    })
], InvoicePreviewModalComponent);
//# sourceMappingURL=invoice-preview-modal.component.js.map