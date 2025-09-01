import { Component, Inject } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './auth.config';
import { microsoftAuthConfig } from './microsoft-auth.config';
import { GOOGLE_OAUTH_SERVICE, MICROSOFT_OAUTH_SERVICE } from './oauth.factory';

@Component({
  selector: 'app-mail-authentication',
  templateUrl: './mail-authentication.component.html',
  styleUrls: ['./mail-authentication.component.css']
})
export class MailAuthenticationComponent {
  googleConnectedAccount: string | null = null;
  microsoftConnectedAccount: string | null = null;
  private googleInitialized = false;
  private microsoftInitialized = false;

  constructor(
    @Inject(GOOGLE_OAUTH_SERVICE) private googleOauthService: OAuthService,
    @Inject(MICROSOFT_OAUTH_SERVICE) private microsoftOauthService: OAuthService
  ) {}

  private async initGoogle() {
    if (this.googleInitialized) return;
    try {
      this.googleOauthService.configure(authConfig);
      await this.googleOauthService.loadDiscoveryDocument();
    } catch {}
    this.googleInitialized = true;
  }

  private async initMicrosoft() {
    if (this.microsoftInitialized) return;
    try {
      this.microsoftOauthService.configure(microsoftAuthConfig);
      await this.microsoftOauthService.loadDiscoveryDocument();
    } catch {}
    this.microsoftInitialized = true;
  }

  async connectToGoogle() {
    await this.initGoogle();
    try {
      this.googleOauthService.initLoginFlowInPopup();
    } catch {}
  }

  async connectToMicrosoft() {
    await this.initMicrosoft();
    try {
      this.microsoftOauthService.initLoginFlowInPopup();
    } catch {}
  }
}
