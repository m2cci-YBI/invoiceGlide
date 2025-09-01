import { __decorate } from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
export let PageHeaderComponent = class PageHeaderComponent {
    constructor() {
        this.title = '';
        this.subtitle = '';
        this.buttonText = '';
        this.buttonClick = new EventEmitter();
    }
};
__decorate([
    Input()
], PageHeaderComponent.prototype, "title", void 0);
__decorate([
    Input()
], PageHeaderComponent.prototype, "subtitle", void 0);
__decorate([
    Input()
], PageHeaderComponent.prototype, "buttonText", void 0);
__decorate([
    Output()
], PageHeaderComponent.prototype, "buttonClick", void 0);
PageHeaderComponent = __decorate([
    Component({
        selector: 'app-page-header',
        templateUrl: './page-header.component.html',
        styleUrls: ['./page-header.component.css']
    })
], PageHeaderComponent);
//# sourceMappingURL=page-header.component.js.map