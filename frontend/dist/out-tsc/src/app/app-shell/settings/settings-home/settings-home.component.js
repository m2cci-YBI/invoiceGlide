import { __decorate } from "tslib";
import { Component } from '@angular/core';
export let SettingsHomeComponent = class SettingsHomeComponent {
    constructor(route) {
        this.route = route;
        console.log('[SettingsHomeComponent] ctor');
    }
    ngOnInit() {
        console.log('[SettingsHomeComponent] ngOnInit path=', this.route.snapshot.routeConfig?.path);
    }
};
SettingsHomeComponent = __decorate([
    Component({
        selector: 'app-settings-home',
        templateUrl: './settings-home.component.html',
        styleUrls: ['./settings-home.component.css']
    })
], SettingsHomeComponent);
//# sourceMappingURL=settings-home.component.js.map