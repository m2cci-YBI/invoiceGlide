package com.invoice.mailing.api.dto;

import jakarta.validation.constraints.NotBlank;

public class SendReminderRequest {
    @NotBlank
    private String invoiceId;
    private String to;

    public String getInvoiceId() { return invoiceId; }
    public void setInvoiceId(String invoiceId) { this.invoiceId = invoiceId; }
    public String getTo() { return to; }
    public void setTo(String to) { this.to = to; }
}

