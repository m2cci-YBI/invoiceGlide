import { __decorate } from "tslib";
import { NgModule, NgZone } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { DashboardComponent } from './app-shell/dashboard/dashboard.component';
import { AppShellComponent } from './app-shell/app-shell.component';
import { InvoicesComponent } from './app-shell/invoices/invoices.component';
import { InvoiceDetailComponent } from './app-shell/invoices/invoice-detail/invoice-detail.component';
import { CustomersComponent } from './app-shell/customers/customers.component';
import { SettingsComponent } from './app-shell/settings/settings.component';
import { NewInvoiceComponent } from './app-shell/new-invoice/new-invoice.component';
import { InvoicePreviewComponent } from './app-shell/invoices/invoice-preview/invoice-preview.component';
import { SettingsHomeComponent } from './app-shell/settings/settings-home/settings-home.component';
import { SettingsInvoiceTemplateComponent } from './app-shell/settings/settings-invoice-template/settings-invoice-template.component';
import { SettingsMailTemplatesComponent } from './app-shell/settings/settings-mail-templates/settings-mail-templates.component';
import { SettingsRemindersComponent } from './app-shell/settings/settings-reminders/settings-reminders.component';
import { SettingsSubscriptionComponent } from './app-shell/settings/settings-subscription/settings-subscription.component';
import { OnboardingComponent } from './app-shell/onboarding/onboarding.component';
import { ColorPickerComponent } from './app-shell/settings/color-picker/color-picker.component';
import { AuthComponent } from './auth/auth.component';
import { EmailConfirmationComponent } from './auth/email-confirmation/email-confirmation.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { PageHeaderComponent } from './app-shell/page-header/page-header.component';
import { ModalComponent } from './app-shell/customers/modal/modal.component';
import { StatusBadgeComponent } from './app-shell/invoices/status-badge/status-badge.component';
import { InvoicePreviewModalComponent } from './app-shell/settings/invoice-preview-modal/invoice-preview-modal.component';
import { LineChartComponent } from './app-shell/dashboard/line-chart/line-chart.component';
import { MailAuthenticationComponent } from './app-shell/settings/settings-mail-templates/mail-authentication/mail-authentication.component';
import { ToastContainerComponent } from './shared/toast-container/toast-container.component';
import { GOOGLE_OAUTH_SERVICE, MICROSOFT_OAUTH_SERVICE, oAuthServiceFactory } from './app-shell/settings/settings-mail-templates/mail-authentication/oauth.factory';
import { OAuthStorage, ValidationHandler, UrlHelperService, OAuthLogger, HashHandler, DateTimeProvider } from 'angular-oauth2-oidc';
import { authConfig } from './app-shell/settings/settings-mail-templates/mail-authentication/auth.config';
import { microsoftAuthConfig } from './app-shell/settings/settings-mail-templates/mail-authentication/microsoft-auth.config';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';
import { DefaultHashHandler, SystemDateTimeProvider } from 'angular-oauth2-oidc';
import { DOCUMENT } from '@angular/common';
import { AuthInterceptor } from './auth/auth.interceptor';
export let AppModule = class AppModule {
};
AppModule = __decorate([
    NgModule({
        declarations: [
            AppComponent,
            LandingComponent,
            DashboardComponent,
            AppShellComponent,
            InvoicesComponent,
            InvoiceDetailComponent,
            CustomersComponent,
            SettingsComponent,
            NewInvoiceComponent,
            InvoicePreviewComponent,
            SettingsHomeComponent,
            SettingsInvoiceTemplateComponent,
            SettingsMailTemplatesComponent,
            SettingsRemindersComponent,
            SettingsSubscriptionComponent,
            OnboardingComponent,
            ColorPickerComponent,
            PageHeaderComponent,
            ModalComponent,
            StatusBadgeComponent,
            InvoicePreviewModalComponent,
            LineChartComponent,
            MailAuthenticationComponent,
            AuthComponent,
            EmailConfirmationComponent,
            ForgotPasswordComponent,
            ResetPasswordComponent,
            ToastContainerComponent,
        ],
        imports: [
            BrowserModule,
            AppRoutingModule,
            FormsModule,
            ReactiveFormsModule,
            CommonModule,
            HttpClientModule
        ],
        providers: [
            { provide: GOOGLE_OAUTH_SERVICE, useFactory: oAuthServiceFactory, deps: [NgZone, HttpClient, OAuthStorage, ValidationHandler, UrlHelperService, OAuthLogger, HashHandler, Document, DateTimeProvider, 'googleAuthConfig'] },
            { provide: MICROSOFT_OAUTH_SERVICE, useFactory: oAuthServiceFactory, deps: [NgZone, HttpClient, OAuthStorage, ValidationHandler, UrlHelperService, OAuthLogger, HashHandler, Document, DateTimeProvider, 'microsoftAuthConfig'] },
            { provide: 'googleAuthConfig', useValue: authConfig },
            { provide: 'microsoftAuthConfig', useValue: microsoftAuthConfig },
            { provide: OAuthStorage, useValue: localStorage },
            { provide: ValidationHandler, useClass: JwksValidationHandler },
            { provide: UrlHelperService, useClass: UrlHelperService },
            { provide: OAuthLogger, useValue: console },
            { provide: HashHandler, useClass: DefaultHashHandler },
            { provide: DateTimeProvider, useClass: SystemDateTimeProvider },
            { provide: Document, useExisting: DOCUMENT },
            { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
        ],
        bootstrap: [AppComponent]
    })
], AppModule);
//# sourceMappingURL=app.module.js.map