import { __decorate } from "tslib";
import { Component, EventEmitter, Output } from '@angular/core';
export let ModalComponent = class ModalComponent {
    constructor() {
        this.close = new EventEmitter();
    }
};
__decorate([
    Output()
], ModalComponent.prototype, "close", void 0);
ModalComponent = __decorate([
    Component({
        selector: 'app-modal',
        templateUrl: './modal.component.html',
        styleUrls: ['./modal.component.css']
    })
], ModalComponent);
//# sourceMappingURL=modal.component.js.map