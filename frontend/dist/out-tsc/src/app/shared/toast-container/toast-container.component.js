import { __decorate } from "tslib";
import { Component } from '@angular/core';
export let ToastContainerComponent = class ToastContainerComponent {
    constructor(toast) {
        this.toast = toast;
        this.toasts = [];
    }
    ngOnInit() {
        this.sub = this.toast.toasts$.subscribe(list => this.toasts = list);
    }
    ngOnDestroy() {
        this.sub?.unsubscribe();
    }
    close(id) {
        this.toast.remove(id);
    }
};
ToastContainerComponent = __decorate([
    Component({
        selector: 'app-toast-container',
        templateUrl: './toast-container.component.html',
        styleUrls: ['./toast-container.component.css']
    })
], ToastContainerComponent);
//# sourceMappingURL=toast-container.component.js.map