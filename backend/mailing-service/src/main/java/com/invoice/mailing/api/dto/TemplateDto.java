package com.invoice.mailing.api.dto;

public class TemplateDto {
    private String id;
    private String name;
    private String subject;
    private String bodyHtml;

    public TemplateDto() {}
    public TemplateDto(String id, String name, String subject, String bodyHtml) {
        this.id = id; this.name = name; this.subject = subject; this.bodyHtml = bodyHtml;
    }
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getBodyHtml() { return bodyHtml; }
    public void setBodyHtml(String bodyHtml) { this.bodyHtml = bodyHtml; }
}

