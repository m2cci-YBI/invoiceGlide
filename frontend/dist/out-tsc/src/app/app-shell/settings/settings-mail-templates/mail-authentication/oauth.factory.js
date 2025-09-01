import { InjectionToken } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
export const GOOGLE_OAUTH_SERVICE = new InjectionToken('google-oauth-service');
export const MICROSOFT_OAUTH_SERVICE = new InjectionToken('microsoft-oauth-service');
export function oAuthServiceFactory(ngZone, http, storage, tokenValidationHandler, urlHelper, logger, crypto, document, dateTimeService, config) {
    return new OAuthService(ngZone, http, storage, tokenValidationHandler, config, urlHelper, logger, crypto, document, dateTimeService);
}
//# sourceMappingURL=oauth.factory.js.map