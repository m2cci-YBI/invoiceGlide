package com.invoice.mailing.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class SendTestRequest {
    @Email @NotBlank
    private String to;
    private String templateId;

    public String getTo() { return to; }
    public void setTo(String to) { this.to = to; }
    public String getTemplateId() { return templateId; }
    public void setTemplateId(String templateId) { this.templateId = templateId; }
}

