import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { INVOICE_API } from './core/invoice-api';
const STORAGE_KEY = 'companySettings';
export let SettingsService = class SettingsService {
    constructor(http) {
        this.http = http;
        this.settings = {
            legalName: '',
            taxId: '',
            supportEmail: '',
            legalFooter: '',
            currency: 'CAD',
            dateFormat: 'YYYY‑MM‑DD',
            numberFormat: '1,234.56',
            logoDataUrl: 'assets/logo.png',
            invoiceNumberPrefix: 'INV-{YYYY}-',
            invoiceNumberCounter: 1,
            templateTaxes: [],
            templateDiscounts: [],
            invoiceStyles: {
                headerTitle: { fontFamily: 'system-ui, Arial, sans-serif', fontSize: 20, color: '#111827', fontWeight: '600' },
                invoiceNumber: { fontFamily: 'system-ui, Arial, sans-serif', fontSize: 16, color: '#111827', fontWeight: '600' },
                companyName: { fontFamily: 'system-ui, Arial, sans-serif', fontSize: 16, color: '#111827', fontWeight: '600' },
                metaLabel: { fontFamily: 'system-ui, Arial, sans-serif', fontSize: 12, color: '#6B7280', fontWeight: '400' },
                issueDateLabel: { fontFamily: 'system-ui, Arial, sans-serif', fontSize: 12, color: '#6B7280', fontWeight: '400' },
                dueDateLabel: { fontFamily: 'system-ui, Arial, sans-serif', fontSize: 12, color: '#6B7280', fontWeight: '400' },
                // Split metaValue into independent keys
                issueDateValue: { fontFamily: 'system-ui, Arial, sans-serif', fontSize: 14, color: '#111827', fontWeight: '400' },
                dueDateValue: { fontFamily: 'system-ui, Arial, sans-serif', fontSize: 14, color: '#111827', fontWeight: '400' },
                companyEmail: { fontFamily: 'system-ui, Arial, sans-serif', fontSize: 12, color: '#6B7280', fontWeight: '400' },
                billToEmail: { fontFamily: 'system-ui, Arial, sans-serif', fontSize: 12, color: '#6B7280', fontWeight: '400' },
                billToLabel: { fontFamily: 'system-ui, Arial, sans-serif', fontSize: 12, color: '#6B7280', fontWeight: '400' },
                billToName: { fontFamily: 'system-ui, Arial, sans-serif', fontSize: 14, color: '#111827', fontWeight: '500' },
                tableHeader: { fontFamily: 'system-ui, Arial, sans-serif', fontSize: 12, color: '#6B7280', fontWeight: '500' },
                tableCell: { fontFamily: 'system-ui, Arial, sans-serif', fontSize: 13, color: '#111827', fontWeight: '400' },
                summaryLabel: { fontFamily: 'system-ui, Arial, sans-serif', fontSize: 13, color: '#111827', fontWeight: '400' },
                summaryValue: { fontFamily: 'system-ui, Arial, sans-serif', fontSize: 13, color: '#111827', fontWeight: '400' },
                summaryTotal: { fontFamily: 'system-ui, Arial, sans-serif', fontSize: 14, color: '#111827', fontWeight: '600' },
                footer: { fontFamily: 'system-ui, Arial, sans-serif', fontSize: 12, color: '#6B7280', fontWeight: '400' },
            },
            emailTemplates: [
                {
                    id: 'TPL-001',
                    name: 'Invoice',
                    subject: 'Invoice {invoice.number} from {company.name}',
                    body: `
<div style="margin:0;padding:0;background-color:#F3F4F6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#F3F4F6;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:600px;max-width:100%;background-color:#ffffff;border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="padding:24px 28px;border-bottom:1px solid #E5E7EB;">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:600;color:#111827;">{company.name}</div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#6B7280;margin-top:4px;">Invoice {invoice.number}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              <p style="margin:0 0 12px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111827;">Hi {client.name},</p>
              <p style="margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111827;">Thank you for choosing {company.name}. We’ve prepared your invoice and included a quick summary below. You can view, download, and pay securely using the button provided.</p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:8px 0 20px 0;">
                <tr>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6B7280;padding:6px 0;">Invoice</td>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111827;padding:6px 0;" align="right">{invoice.number}</td>
                </tr>
                <tr>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6B7280;padding:6px 0;">Due date</td>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111827;padding:6px 0;" align="right">{invoice.dueDate}</td>
                </tr>
                <tr>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6B7280;padding:6px 0;">Amount due</td>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#111827;font-weight:600;padding:6px 0;" align="right">{invoice.total}</td>
                </tr>
              </table>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:16px 0 24px 0;">
                <tr>
                  <td align="center" bgcolor="#2563EB" style="border-radius:6px;">
                    <!-- Button removed: emails include PDF attachment; no direct link -->
                  </td>
                </tr>
              </table>

              <div style="margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#111827;">
                <div style="font-weight:600;margin-bottom:6px;">Payment options</div>
                <p style="margin:0 0 10px 0;">The secure payment page supports multiple payment methods. If you prefer bank transfer, please use reference <strong>{invoice.number}</strong> so we can match your payment quickly.</p>
              </div>

              <div style="margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#111827;">
                <div style="font-weight:600;margin-bottom:6px;">What happens next</div>
                <p style="margin:0;">Once payment is completed, you’ll receive an automatic confirmation email and a receipt for your records. If you have questions about this invoice or need any changes, reply to this email and our team will help.</p>
              </div>

              <p style="margin:12px 0 6px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6B7280;">Questions? Contact us at <a href="mailto:{company.email}" style="color:#2563EB;text-decoration:none;">{company.email}</a>. For your security, only use the official link above to view and pay.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px;border-top:1px solid #E5E7EB;">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6B7280;">© {company.name}. All rights reserved.</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>`
                },
                {
                    id: 'TPL-002',
                    name: 'Reminder',
                    subject: 'Reminder: Invoice {invoice.number} due on {invoice.dueDate}',
                    body: `
<div style="margin:0;padding:0;background-color:#FFF7ED;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#FFF7ED;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:600px;max-width:100%;background-color:#ffffff;border:1px solid #FED7AA;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="padding:24px 28px;border-bottom:1px solid #FED7AA;">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:600;color:#111827;">Payment Reminder</div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#6B7280;margin-top:4px;">Invoice {invoice.number} for {invoice.total}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              <p style="margin:0 0 12px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111827;">Hi {client.name},</p>
              <p style="margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111827;">This is a friendly reminder that payment for the invoice below is due on <strong>{invoice.dueDate}</strong>. We appreciate your prompt attention.</p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:8px 0 16px 0;">
                <tr>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6B7280;padding:6px 0;">Invoice</td>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111827;padding:6px 0;" align="right">{invoice.number}</td>
                </tr>
                <tr>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6B7280;padding:6px 0;">Amount due</td>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#111827;font-weight:600;padding:6px 0;" align="right">{invoice.total}</td>
                </tr>
              </table>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:16px 0 20px 0;">
                <tr>
                  <td align="center" bgcolor="#EA580C" style="border-radius:6px;">
                    <!-- Button removed: reminder excludes payment link by design -->
                  </td>
                </tr>
              </table>

              <div style="margin:0 0 14px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#111827;">
                <div style="font-weight:600;margin-bottom:6px;">Need more time?</div>
                <p style="margin:0;">If you’ve already paid, thank you—please ignore this message. If you anticipate any delay or need an updated copy of the invoice, reply to this email and we’ll be happy to assist.</p>
              </div>

              <p style="margin:8px 0 6px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6B7280;">Questions? We’re here to help at <a href="mailto:{company.email}" style="color:#2563EB;text-decoration:none;">{company.email}</a>.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px;border-top:1px solid #FED7AA;">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6B7280;">Thank you for choosing {company.name}. We value your business.</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>`
                },
                {
                    id: 'TPL-003',
                    name: 'Receipt',
                    subject: 'Payment received for Invoice {invoice.number}',
                    body: `
<div style="margin:0;padding:0;background-color:#ECFDF5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#ECFDF5;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:600px;max-width:100%;background-color:#ffffff;border:1px solid #D1FAE5;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="padding:24px 28px;border-bottom:1px solid #D1FAE5;">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:600;color:#111827;">Payment Confirmation</div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#6B7280;margin-top:4px;">Invoice {invoice.number}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              <p style="margin:0 0 12px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111827;">Hi {client.name},</p>
              <p style="margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111827;">We’re writing to confirm that we’ve received your payment for the invoice below. Thank you for your prompt payment and for being a valued customer.</p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:8px 0 16px 0;">
                <tr>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6B7280;padding:6px 0;">Invoice</td>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111827;padding:6px 0;" align="right">{invoice.number}</td>
                </tr>
                <tr>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6B7280;padding:6px 0;">Amount paid</td>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:16px;color:#111827;font-weight:600;padding:6px 0;" align="right">{invoice.total}</td>
                </tr>
                <tr>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6B7280;padding:6px 0;">Payment date</td>
                  <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111827;padding:6px 0;" align="right">{payment.date}</td>
                </tr>
              </table>

              <p style="margin:0 0 14px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#111827;">Your invoice is attached to this email as a PDF. You can download it for your records.</p>

              <div style="margin:0 0 14px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#111827;">
                <div style="font-weight:600;margin-bottom:6px;">Need anything else?</div>
                <p style="margin:0;">If you require a formal receipt or have questions about this payment, reply to this email or contact us at <a href="mailto:{company.email}" style="color:#2563EB;text-decoration:none;">{company.email}</a>. We’re happy to help.</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px;border-top:1px solid #D1FAE5;">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6B7280;">© {company.name}. We appreciate your business.</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>`
                },
            ]
        };
        this.loadFromBackend().subscribe();
    }
    load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                const defaults = this.settings;
                const mergedStyles = { ...(defaults.invoiceStyles || {}), ...((parsed.invoiceStyles) || {}) };
                this.settings = {
                    ...defaults,
                    ...parsed,
                    templateTaxes: Array.isArray(parsed.templateTaxes) ? parsed.templateTaxes : defaults.templateTaxes,
                    templateDiscounts: Array.isArray(parsed.templateDiscounts) ? parsed.templateDiscounts : defaults.templateDiscounts,
                    invoiceStyles: mergedStyles,
                };
            }
        }
        catch {
            // ignore parse errors
        }
    }
    save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
        // Persist to backend (fire-and-forget)
        this.http.put(`${INVOICE_API}/settings`, this.settings).subscribe({ next: () => { }, error: () => { } });
    }
    loadFromBackend() {
        return this.http.get(`${INVOICE_API}/settings`).pipe(tap(remote => {
            if (remote) {
                const defaults = this.settings;
                const mergedStyles = { ...(defaults.invoiceStyles || {}), ...(remote.invoiceStyles || {}) };
                this.settings = {
                    ...defaults,
                    ...remote,
                    templateTaxes: Array.isArray(remote.templateTaxes) ? remote.templateTaxes : defaults.templateTaxes,
                    templateDiscounts: Array.isArray(remote.templateDiscounts) ? remote.templateDiscounts : defaults.templateDiscounts,
                    invoiceStyles: mergedStyles,
                };
                // Cache locally too
                localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
            }
        }), catchError(() => {
            // Fallback to local storage if backend not reachable
            this.load();
            return of(this.settings);
        }));
    }
    formatCurrency(n, code) {
        const fmt = this.settings.numberFormat === '1.234,56' ? 'de-DE' : 'en-CA';
        const currencyCode = code || this.settings.currency || 'CAD';
        return new Intl.NumberFormat(fmt, { style: 'currency', currency: currencyCode }).format(n || 0);
    }
    formatDate(input) {
        const d = typeof input === 'string' ? new Date(input) : input;
        const pad = (x) => x.toString().padStart(2, '0');
        const yyyy = d.getFullYear();
        const mm = pad(d.getMonth() + 1);
        const dd = pad(d.getDate());
        switch (this.settings.dateFormat) {
            case 'DD/MM/YYYY':
                return `${dd}/${mm}/${yyyy}`;
            case 'MM/DD/YYYY':
                return `${mm}/${dd}/${yyyy}`;
            default:
                return `${yyyy}-${mm}-${dd}`;
        }
    }
};
SettingsService = __decorate([
    Injectable({ providedIn: 'root' })
], SettingsService);
//# sourceMappingURL=settings.service.js.map