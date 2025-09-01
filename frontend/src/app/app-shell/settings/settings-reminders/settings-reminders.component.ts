import { Component } from '@angular/core';
import { MailApiService } from '../../../mail-api.service';
import { ToastService } from '../../../shared/toast.service';

@Component({
  selector: 'app-settings-reminders',
  templateUrl: './settings-reminders.component.html',
  styleUrls: ['./settings-reminders.component.css']
})
export class SettingsRemindersComponent {
  reminders: { label: string; days: number; enabled: boolean }[] = [];

  constructor(private mailApi: MailApiService, private toast: ToastService) {
    this.load();
  }

  load() {
    this.mailApi.getReminderSchedules().subscribe(r => {
      this.reminders = (r || []).map(x => ({ label: this.labelFor(x.daysAfterDue), days: x.daysAfterDue, enabled: !!x.enabled }));
    });
  }

  save() {
    const payload = this.reminders.map(r => ({ name: r.label, daysAfterDue: r.days, enabled: r.enabled }));
    this.mailApi.saveReminderSchedules(payload).subscribe(() => this.toast?.success('Reminders saved'), _ => this.toast?.error('Failed to save reminders'));
  }

  private labelFor(days: number) {
    if (days < 0) return `T${days}`; if (days === 0) return 'T+0 (on due)'; return `T+${days}`;
  }
}

