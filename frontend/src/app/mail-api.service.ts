import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MAIL_API } from './core/mail-api';

@Injectable({ providedIn: 'root' })
export class MailApiService {
  constructor(private http: HttpClient) {}

  sendInvoice(invoiceId: string, to?: string): Observable<{ id: string; status: string }> {
    return this.http.post<{ id: string; status: string }>(`${MAIL_API}/send/invoice`, { invoiceId, to });
  }

  sendTest(to: string, templateId?: string): Observable<{ id: string; status: string }> {
    return this.http.post<{ id: string; status: string }>(`${MAIL_API}/send/test`, { to, templateId });
  }

  sendReminder(invoiceId: string, to?: string): Observable<{ id: string; status: string }> {
    return this.http.post<{ id: string; status: string }>(`${MAIL_API}/send/reminder`, { invoiceId, to });
  }

  listTemplates(): Observable<any[]> {
    return this.http.get<any[]>(`${MAIL_API}/templates`);
  }

  getTemplate(id: string): Observable<any> {
    return this.http.get<any>(`${MAIL_API}/templates/${id}`);
  }

  updateTemplate(id: string, body: any): Observable<any> {
    return this.http.put<any>(`${MAIL_API}/templates/${id}`, body);
  }

  renderTemplate(templateId: string, model: any): Observable<{ html: string }> {
    return this.http.post<{ html: string }>(`${MAIL_API}/templates/render`, { templateId, model });
  }

  renderSubject(templateId: string, model: any): Observable<{ subject: string }> {
    return this.http.post<{ subject: string }>(`${MAIL_API}/templates/render-subject`, { templateId, model });
  }

  getReminderSchedules(): Observable<Array<{ name: string; daysAfterDue: number; enabled: boolean }>> {
    return this.http.get<Array<{ name: string; daysAfterDue: number; enabled: boolean }>>(`${MAIL_API}/schedules/reminders`);
  }

  saveReminderSchedules(rules: Array<{ name: string; daysAfterDue: number; enabled: boolean }>) {
    return this.http.put(`${MAIL_API}/schedules/reminders`, rules);
  }

  getReminderStats(windowDays = 7): Observable<{ scheduledNext7d: number; sentLast7d: number }> {
    return this.http.get<{ scheduledNext7d: number; sentLast7d: number }>(`${MAIL_API}/stats/reminders`, { params: { windowDays } as any });
  }
}
