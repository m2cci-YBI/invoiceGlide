import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private settings: SettingsService) { }

  currency(n: number, code?: string) {
    return this.settings.formatCurrency(n, code);
  }
}
