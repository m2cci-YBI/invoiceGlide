import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { AppShellComponent } from './app-shell/app-shell.component';
import { DashboardComponent } from './app-shell/dashboard/dashboard.component';
import { InvoicesComponent } from './app-shell/invoices/invoices.component';
import { InvoiceDetailComponent } from './app-shell/invoices/invoice-detail/invoice-detail.component';
import { CustomersComponent } from './app-shell/customers/customers.component';
import { SettingsComponent } from './app-shell/settings/settings.component';
import { SettingsHomeComponent } from './app-shell/settings/settings-home/settings-home.component';
import { SettingsInvoiceTemplateComponent } from './app-shell/settings/settings-invoice-template/settings-invoice-template.component';
import { SettingsMailTemplatesComponent } from './app-shell/settings/settings-mail-templates/settings-mail-templates.component';
import { SettingsRemindersComponent } from './app-shell/settings/settings-reminders/settings-reminders.component';
import { SettingsSubscriptionComponent } from './app-shell/settings/settings-subscription/settings-subscription.component';
import { NewInvoiceComponent } from './app-shell/new-invoice/new-invoice.component';
import { OnboardingComponent } from './app-shell/onboarding/onboarding.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { EmailConfirmationComponent } from './auth/email-confirmation/email-confirmation.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'confirm-email', component: EmailConfirmationComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: '',
    component: AppShellComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'invoices/:id', component: InvoiceDetailComponent },
      { path: 'invoices', component: InvoicesComponent },
      { path: 'clients', component: CustomersComponent },
      { path: 'onboarding', component: OnboardingComponent },
      { 
        path: 'settings',
        component: SettingsComponent,
        children: [
          { path: '', component: SettingsHomeComponent, pathMatch: 'full' },
          { path: 'invoice-settings', component: SettingsInvoiceTemplateComponent },
          { path: 'mail-settings', component: SettingsMailTemplatesComponent },
          { path: 'reminders', component: SettingsRemindersComponent },
          { path: 'subscription', component: SettingsSubscriptionComponent },
        ]
      },
      { path: 'new-invoice', component: NewInvoiceComponent },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
