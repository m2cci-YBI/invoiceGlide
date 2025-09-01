import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { MAIL_API } from './core/mail-api';
export let MailApiService = class MailApiService {
    constructor(http) {
        this.http = http;
    }
    sendInvoice(invoiceId, to) {
        return this.http.post(`${MAIL_API}/send/invoice`, { invoiceId, to });
    }
    sendTest(to, templateId) {
        return this.http.post(`${MAIL_API}/send/test`, { to, templateId });
    }
    sendReminder(invoiceId, to) {
        return this.http.post(`${MAIL_API}/send/reminder`, { invoiceId, to });
    }
    listTemplates() {
        return this.http.get(`${MAIL_API}/templates`);
    }
    getTemplate(id) {
        return this.http.get(`${MAIL_API}/templates/${id}`);
    }
    updateTemplate(id, body) {
        return this.http.put(`${MAIL_API}/templates/${id}`, body);
    }
    renderTemplate(templateId, model) {
        return this.http.post(`${MAIL_API}/templates/render`, { templateId, model });
    }
    renderSubject(templateId, model) {
        return this.http.post(`${MAIL_API}/templates/render-subject`, { templateId, model });
    }
    getReminderSchedules() {
        return this.http.get(`${MAIL_API}/schedules/reminders`);
    }
    saveReminderSchedules(rules) {
        return this.http.put(`${MAIL_API}/schedules/reminders`, rules);
    }
    getReminderStats(windowDays = 7) {
        return this.http.get(`${MAIL_API}/stats/reminders`, { params: { windowDays } });
    }
};
MailApiService = __decorate([
    Injectable({ providedIn: 'root' })
], MailApiService);
//# sourceMappingURL=mail-api.service.js.map