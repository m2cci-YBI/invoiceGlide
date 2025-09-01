import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { SettingsBaseComponent } from './settings-base.component';
export let SettingsComponent = class SettingsComponent extends SettingsBaseComponent {
    constructor(settingsService, route, router) {
        super(settingsService);
        this.settingsService = settingsService;
        this.route = route;
        this.router = router;
        console.log('[SettingsComponent] ctor route=', this.route.snapshot.url.map(s => s.path).join('/'));
    }
    ngOnInit() {
        console.log('[SettingsComponent] ngOnInit url=', this.router.url);
        this.route.url.subscribe(u => console.log('[SettingsComponent] route.url=', u.map(s => s.path).join('/')));
        this.route.firstChild?.url.subscribe(u => console.log('[SettingsComponent] firstChild.url=', u.map(s => s.path).join('/')));
        this.router.events.subscribe(e => {
            // Keep logs concise
            const t = e.constructor?.name;
            if (t === 'NavigationStart' || t === 'NavigationEnd') {
                console.log('[Router]', t, e.url);
            }
        });
    }
};
SettingsComponent = __decorate([
    Component({
        selector: 'app-settings',
        templateUrl: './settings.component.html',
        styleUrls: ['./settings.component.css']
    })
], SettingsComponent);
//# sourceMappingURL=settings.component.js.map