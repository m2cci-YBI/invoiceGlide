import { Directive, Optional } from '@angular/core';
import { SettingsService, CompanySettings } from '../../settings.service';
import { ToastService } from '../../shared/toast.service';

@Directive()
export abstract class SettingsBaseComponent {
  settings: CompanySettings;
  showPreview = false;

  constructor(public settingsService: SettingsService, @Optional() protected toast?: ToastService) {
    this.settings = this.settingsService.settings;
  }

  saveSettings() {
    this.settingsService.save();
    this.toast?.success('Settings saved');
  }

  async onLogoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
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

  removeTemplateTax(idx: number) {
    this.settings.templateTaxes.splice(idx, 1);
    this.settingsService.save();
  }

  addTemplateDiscount() {
    this.settings.templateDiscounts.push({ name: 'Discount', type: 'percent', value: 0 });
    this.settingsService.save();
  }

  removeTemplateDiscount(idx: number) {
    this.settings.templateDiscounts.splice(idx, 1);
    this.settingsService.save();
  }

  protected readAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
