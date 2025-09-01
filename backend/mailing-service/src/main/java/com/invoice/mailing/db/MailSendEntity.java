package com.invoice.mailing.db;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "mail_send")
public class MailSendEntity {
    @Id
    @GeneratedValue
    private UUID id;
    private UUID orgId;
    private UUID invoiceId;
    private UUID clientId;
    private String toEmail;
    @Column(length = 2048)
    private String subject;
    private String templateId;
    private String templateType; // INVOICE | REMINDER | RECEIPT
    private String channel; // API | SMTP
    private String status; // SENT | FAILED | etc.
    @Column(length = 1024)
    private String providerMsgId;
    private String errorCode;
    @Column(length = 2048)
    private String errorMsg;
    private Integer ruleOffset; // for reminders
    private java.time.LocalDate eventDate; // dueDate + offset (UTC)
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getOrgId() { return orgId; }
    public void setOrgId(UUID orgId) { this.orgId = orgId; }
    public UUID getInvoiceId() { return invoiceId; }
    public void setInvoiceId(UUID invoiceId) { this.invoiceId = invoiceId; }
    public UUID getClientId() { return clientId; }
    public void setClientId(UUID clientId) { this.clientId = clientId; }
    public String getToEmail() { return toEmail; }
    public void setToEmail(String toEmail) { this.toEmail = toEmail; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getTemplateId() { return templateId; }
    public void setTemplateId(String templateId) { this.templateId = templateId; }
    public String getTemplateType() { return templateType; }
    public void setTemplateType(String templateType) { this.templateType = templateType; }
    public String getChannel() { return channel; }
    public void setChannel(String channel) { this.channel = channel; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getProviderMsgId() { return providerMsgId; }
    public void setProviderMsgId(String providerMsgId) { this.providerMsgId = providerMsgId; }
    public String getErrorCode() { return errorCode; }
    public void setErrorCode(String errorCode) { this.errorCode = errorCode; }
    public String getErrorMsg() { return errorMsg; }
    public void setErrorMsg(String errorMsg) { this.errorMsg = errorMsg; }
    public Integer getRuleOffset() { return ruleOffset; }
    public void setRuleOffset(Integer ruleOffset) { this.ruleOffset = ruleOffset; }
    public java.time.LocalDate getEventDate() { return eventDate; }
    public void setEventDate(java.time.LocalDate eventDate) { this.eventDate = eventDate; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
