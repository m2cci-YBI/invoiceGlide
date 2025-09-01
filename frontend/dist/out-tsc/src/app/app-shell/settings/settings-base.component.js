import { __decorate, __param } from "tslib";
import { Directive, Optional } from '@angular/core';
export let SettingsBaseComponent = class SettingsBaseComponent {
    constructor(settingsService, toast) {
        this.settingsService = settingsService;
        this.toast = toast;
        this.showPreview = false;
        this.settings = this.settingsService.settings;
    }
    saveSettings() {
        this.settingsService.save();
        this.toast?.success('Settings saved');
    }
    async onLogoSelected(event) {
        const input = event.target;
        if (!input.files || input.files.length === 0)
            return;
        const file = input.files[0];
        // Limit: 5MB
        const MAX_BYTES = 5 * 1024 * 1024;
        if (file.size > MAX_BYTES) {
            this.toast?.error('Please choose an image under 5MB.');
            input.value = '';
            return;
        }
        const dataUrl = await this.readAsDataURL(file);
        this.settings.logoDataUrl = dataUrl;
        this.settingsService.save();
        this.toast?.success('Logo updated');
    }
    removeLogo() {
        this.settings.logoDataUrl = null;
        this.settingsService.save();
        this.toast?.success('Logo removed');
    }
    openPreview() {
        this.showPreview = true;
    }
    closePreview() {
        this.showPreview = false;
    }
    addTemplateTax() {
        this.settings.templateTaxes.push({ name: 'New tax', ratePct: 0 });
        this.settingsService.save();
    }
    removeTemplateTax(idx) {
        this.settings.templateTaxes.splice(idx, 1);
        this.settingsService.save();
    }
    addTemplateDiscount() {
        this.settings.templateDiscounts.push({ name: 'Discount', type: 'percent', value: 0 });
        this.settingsService.save();
    }
    removeTemplateDiscount(idx) {
        this.settings.templateDiscounts.splice(idx, 1);
        this.settingsService.save();
    }
    readAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
};
SettingsBaseComponent = __decorate([
    Directive(),
    __param(1, Optional())
], SettingsBaseComponent);
//# sourceMappingURL=settings-base.component.js.map