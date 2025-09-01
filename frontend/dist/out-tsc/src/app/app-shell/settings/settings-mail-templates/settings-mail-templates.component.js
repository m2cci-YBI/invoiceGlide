import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SettingsBaseComponent } from '../settings-base.component';
export let SettingsMailTemplatesComponent = class SettingsMailTemplatesComponent extends SettingsBaseComponent {
    constructor(settingsService, sanitizer, route, mailApi, toast, cdr) {
        super(settingsService, toast);
        this.settingsService = settingsService;
        this.sanitizer = sanitizer;
        this.route = route;
        this.mailApi = mailApi;
        this.cdr = cdr;
        this.selectedTemplateId = 'TPL-INVOICE';
        // Fixed templates: no HTML editing, preview only
        this.showAuth = false;
        this.sanitizedBodyCached = '';
        this.renderedSubject = '';
        this.templates = [];
        console.log('[SettingsMailTemplatesComponent] ctor');
    }
    ngOnInit() {
        console.log('[SettingsMailTemplatesComponent] ngOnInit path=', this.route.snapshot.routeConfig?.path);
        this.loadTemplates();
    }
    loadTemplates() {
        this.mailApi.listTemplates().subscribe(tpls => {
            this.templates = tpls || [];
            const found = this.templates.find((t) => t.id === this.selectedTemplateId) || this.templates[0];
            if (found) {
                this.selectedTemplateId = found.id;
                this.updateSanitized();
            }
        });
    }
    onSelectedTemplateIdChange(id) {
        this.selectedTemplateId = id;
        this.updateSanitized();
        this.toast?.info('Switched template to ' + id);
    }
    updateSanitized() {
        if (!this.selectedTemplateId) {
            this.sanitizedBodyCached = '';
            return;
        }
        const model = this.previewModel();
        this.mailApi.renderSubject(this.selectedTemplateId, model).subscribe(s => {
            this.renderedSubject = s.subject || '';
            this.cdr.markForCheck();
        });
        this.mailApi.renderTemplate(this.selectedTemplateId, model).subscribe(r => {
            this.sanitizedBodyCached = this.sanitizer.bypassSecurityTrustHtml(r.html || '');
            this.cdr.markForCheck();
        }, _ => { this.sanitizedBodyCached = this.sanitizer.bypassSecurityTrustHtml(''); this.cdr.markForCheck(); });
    }
    sendTest() {
        const to = this.settings.supportEmail || '';
        if (!to) {
            this.toast?.error('Set Support Email in settings first');
            return;
        }
        this.mailApi.sendTest(to, this.selectedTemplateId).subscribe(() => {
            this.toast?.success('Test email sent to ' + to);
        }, _ => this.toast?.error('Failed to send test email'));
    }
    toggleAuthSection() {
        this.showAuth = !this.showAuth;
    }
    previewModel() {
        return {
            'company.name': this.settings.legalName || 'InvoiceGlide',
            'company.email': this.settings.supportEmail || 'invoices@invoiceglide.com',
            'client.name': 'Sample Client',
            'client.email': 'client@example.com',
            'invoice.number': 'INV-2025-0001',
            'invoice.total': '$1,234.56',
            'invoice.link': 'https://invoiceglide.com/invoices/INV-2025-0001'
        };
    }
};
SettingsMailTemplatesComponent = __decorate([
    Component({
        selector: 'app-settings-mail-templates',
        templateUrl: './settings-mail-templates.component.html',
        styleUrls: ['./settings-mail-templates.component.css'],
        changeDetection: ChangeDetectionStrategy.OnPush
    })
], SettingsMailTemplatesComponent);
//# sourceMappingURL=settings-mail-templates.component.js.map