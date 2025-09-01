package com.invoice.mailing.api.dto;

import java.util.Map;
import jakarta.validation.constraints.NotBlank;

public class RenderRequest {
    @NotBlank
    private String templateId;
    private Map<String, Object> model;

    public String getTemplateId() { return templateId; }
    public void setTemplateId(String templateId) { this.templateId = templateId; }
    public Map<String, Object> getModel() { return model; }
    public void setModel(Map<String, Object> model) { this.model = model; }
}

