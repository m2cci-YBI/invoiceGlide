package com.invoice.mailing.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "mailing")
public class MailingProperties {
    private String from;
    private String invoiceApiBaseUrl;
    private String appBaseUrl;
    private boolean attachPdf = true;
    private String mailtrapApiToken;
    private String mailtrapApiUrl;

    public String getFrom() { return from; }
    public void setFrom(String from) { this.from = from; }
    public String getInvoiceApiBaseUrl() { return invoiceApiBaseUrl; }
    public void setInvoiceApiBaseUrl(String invoiceApiBaseUrl) { this.invoiceApiBaseUrl = invoiceApiBaseUrl; }
    public String getAppBaseUrl() { return appBaseUrl; }
    public void setAppBaseUrl(String appBaseUrl) { this.appBaseUrl = appBaseUrl; }
    public boolean isAttachPdf() { return attachPdf; }
    public void setAttachPdf(boolean attachPdf) { this.attachPdf = attachPdf; }
    public String getMailtrapApiToken() { return mailtrapApiToken; }
    public void setMailtrapApiToken(String mailtrapApiToken) { this.mailtrapApiToken = mailtrapApiToken; }
    public String getMailtrapApiUrl() { return mailtrapApiUrl; }
    public void setMailtrapApiUrl(String mailtrapApiUrl) { this.mailtrapApiUrl = mailtrapApiUrl; }
}
