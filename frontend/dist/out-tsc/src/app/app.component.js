import { __decorate } from "tslib";
import { Component } from '@angular/core';
export let AppComponent = class AppComponent {
    constructor(router) {
        this.router = router;
        this.title = 'invoice-angular-ui';
    }
    ngOnInit() {
        this.router.events.subscribe(ev => {
            // if (ev instanceof NavigationStart) {
            //   console.log('[App] NavigationStart ->', ev.url);
            // } else if (ev instanceof NavigationEnd) {
            //   console.log('[App] NavigationEnd ->', ev.urlAfterRedirects);
            // }
        });
    }
};
AppComponent = __decorate([
    Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.css']
    })
], AppComponent);
//# sourceMappingURL=app.component.js.map