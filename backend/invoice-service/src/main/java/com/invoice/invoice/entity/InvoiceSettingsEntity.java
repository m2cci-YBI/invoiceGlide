package com.invoice.invoice.entity;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "inv_settings")
public class InvoiceSettingsEntity {
    @Id @GeneratedValue
    private UUID id;
    @Column(nullable = false, unique = true)
    private UUID userId;

    private String legalName;
    private String taxId;
    private String supportEmail;
    @Column(columnDefinition = "text")
    private String legalFooter;
    private String currency;
    private String dateFormat;
    private String numberFormat;
    @Column(columnDefinition = "text")
    private String logoDataUrl;
    private String invoiceNumberPrefix;
    private Integer invoiceNumberCounter;
    @Column(columnDefinition = "text")
    private String templateTaxesJson;
    @Column(columnDefinition = "text")
    private String templateDiscountsJson;
    @Column(columnDefinition = "text")
    private String invoiceStylesJson;
    @Column(columnDefinition = "text")
    private String emailTemplatesJson;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();
    @Column(nullable = false)
    private Instant updatedAt = Instant.now();
    @PreUpdate public void preUpdate(){ this.updatedAt = Instant.now(); }

    // getters/setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public String getLegalName() { return legalName; }
    public void setLegalName(String legalName) { this.legalName = legalName; }
    public String getTaxId() { return taxId; }
    public void setTaxId(String taxId) { this.taxId = taxId; }
    public String getSupportEmail() { return supportEmail; }
    public void setSupportEmail(String supportEmail) { this.supportEmail = supportEmail; }
    public String getLegalFooter() { return legalFooter; }
    public void setLegalFooter(String legalFooter) { this.legalFooter = legalFooter; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getDateFormat() { return dateFormat; }
    public void setDateFormat(String dateFormat) { this.dateFormat = dateFormat; }
    public String getNumberFormat() { return numberFormat; }
    public void setNumberFormat(String numberFormat) { this.numberFormat = numberFormat; }
    public String getLogoDataUrl() { return logoDataUrl; }
    public void setLogoDataUrl(String logoDataUrl) { this.logoDataUrl = logoDataUrl; }
    public String getInvoiceNumberPrefix() { return invoiceNumberPrefix; }
    public void setInvoiceNumberPrefix(String invoiceNumberPrefix) { this.invoiceNumberPrefix = invoiceNumberPrefix; }
    public Integer getInvoiceNumberCounter() { return invoiceNumberCounter; }
    public void setInvoiceNumberCounter(Integer invoiceNumberCounter) { this.invoiceNumberCounter = invoiceNumberCounter; }
    public String getTemplateTaxesJson() { return templateTaxesJson; }
    public void setTemplateTaxesJson(String templateTaxesJson) { this.templateTaxesJson = templateTaxesJson; }
    public String getTemplateDiscountsJson() { return templateDiscountsJson; }
    public void setTemplateDiscountsJson(String templateDiscountsJson) { this.templateDiscountsJson = templateDiscountsJson; }
    public String getInvoiceStylesJson() { return invoiceStylesJson; }
    public void setInvoiceStylesJson(String invoiceStylesJson) { this.invoiceStylesJson = invoiceStylesJson; }
    public String getEmailTemplatesJson() { return emailTemplatesJson; }
    public void setEmailTemplatesJson(String emailTemplatesJson) { this.emailTemplatesJson = emailTemplatesJson; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}

