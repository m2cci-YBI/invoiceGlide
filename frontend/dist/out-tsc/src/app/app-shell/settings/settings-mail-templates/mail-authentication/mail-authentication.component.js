import { __decorate, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { authConfig } from './auth.config';
import { microsoftAuthConfig } from './microsoft-auth.config';
import { GOOGLE_OAUTH_SERVICE, MICROSOFT_OAUTH_SERVICE } from './oauth.factory';
export let MailAuthenticationComponent = class MailAuthenticationComponent {
    constructor(googleOauthService, microsoftOauthService) {
        this.googleOauthService = googleOauthService;
        this.microsoftOauthService = microsoftOauthService;
        this.googleConnectedAccount = null;
        this.microsoftConnectedAccount = null;
        this.googleInitialized = false;
        this.microsoftInitialized = false;
    }
    async initGoogle() {
        if (this.googleInitialized)
            return;
        try {
            this.googleOauthService.configure(authConfig);
            await this.googleOauthService.loadDiscoveryDocument();
        }
        catch { }
        this.googleInitialized = true;
    }
    async initMicrosoft() {
        if (this.microsoftInitialized)
            return;
        try {
            this.microsoftOauthService.configure(microsoftAuthConfig);
            await this.microsoftOauthService.loadDiscoveryDocument();
        }
        catch { }
        this.microsoftInitialized = true;
    }
    async connectToGoogle() {
        await this.initGoogle();
        try {
            this.googleOauthService.initLoginFlowInPopup();
        }
        catch { }
    }
    async connectToMicrosoft() {
        await this.initMicrosoft();
        try {
            this.microsoftOauthService.initLoginFlowInPopup();
        }
        catch { }
    }
};
MailAuthenticationComponent = __decorate([
    Component({
        selector: 'app-mail-authentication',
        templateUrl: './mail-authentication.component.html',
        styleUrls: ['./mail-authentication.component.css']
    }),
    __param(0, Inject(GOOGLE_OAUTH_SERVICE)),
    __param(1, Inject(MICROSOFT_OAUTH_SERVICE))
], MailAuthenticationComponent);
//# sourceMappingURL=mail-authentication.component.js.map