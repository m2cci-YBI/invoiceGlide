import { InjectionToken, NgZone } from '@angular/core';
import { OAuthService, OAuthStorage, ValidationHandler, UrlHelperService, OAuthLogger, HashHandler, DateTimeProvider, AuthConfig } from 'angular-oauth2-oidc';
import { HttpClient } from '@angular/common/http';

export const GOOGLE_OAUTH_SERVICE = new InjectionToken<OAuthService>('google-oauth-service');
export const MICROSOFT_OAUTH_SERVICE = new InjectionToken<OAuthService>('microsoft-oauth-service');

export function oAuthServiceFactory(
    ngZone: NgZone,
    http: HttpClient,
    storage: OAuthStorage,
    tokenValidationHandler: ValidationHandler,
    urlHelper: UrlHelperService,
    logger: OAuthLogger,
    crypto: HashHandler,
    document: Document,
    dateTimeService: DateTimeProvider,
    config: AuthConfig
): OAuthService {
  return new OAuthService(ngZone, http, storage, tokenValidationHandler, config, urlHelper, logger, crypto, document, dateTimeService);
}
