import { __decorate } from "tslib";
import { Component } from '@angular/core';
export let AppShellComponent = class AppShellComponent {
    constructor(settingsService, auth) {
        this.settingsService = settingsService;
        this.auth = auth;
    }
    ngOnInit() {
    }
};
AppShellComponent = __decorate([
    Component({
        selector: 'app-shell',
        templateUrl: './app-shell.component.html',
        styleUrls: ['./app-shell.component.css']
    })
], AppShellComponent);
//# sourceMappingURL=app-shell.component.js.map