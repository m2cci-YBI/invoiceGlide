import { __decorate } from "tslib";
import { Component } from '@angular/core';
export let SettingsRemindersComponent = class SettingsRemindersComponent {
    constructor(mailApi, toast) {
        this.mailApi = mailApi;
        this.toast = toast;
        this.reminders = [];
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
    labelFor(days) {
        if (days < 0)
            return `T${days}`;
        if (days === 0)
            return 'T+0 (on due)';
        return `T+${days}`;
    }
};
SettingsRemindersComponent = __decorate([
    Component({
        selector: 'app-settings-reminders',
        templateUrl: './settings-reminders.component.html',
        styleUrls: ['./settings-reminders.component.css']
    })
], SettingsRemindersComponent);
//# sourceMappingURL=settings-reminders.component.js.map