package com.invoice.invoice.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "inv_invoices")
public class InvoiceEntity {
    @Id @GeneratedValue
    private UUID id;
    @Column(nullable = false)
    private UUID userId;
    @Column(nullable = false, unique = true)
    private String number;
    @Column(nullable = false)
    private UUID clientId;
    @Column(nullable = false)
    private String clientName;
    @Column(nullable = false)
    private LocalDate issueDate;
    @Column(nullable = false)
    private LocalDate dueDate;
    @Column(nullable = false)
    private String currency;
    @Column(nullable = false)
    private BigDecimal subtotal;
    @Column(nullable = false)
    private BigDecimal taxTotal;
    @Column(nullable = false)
    private BigDecimal discountTotal;
    @Column(nullable = false)
    private BigDecimal total;
    @Column(nullable = false)
    private String status; // DRAFT, OPEN, OVERDUE, COLLECTED, CANCELED
    @Column(name = "taxes_json", columnDefinition = "text")
    private String taxesJson; // JSON array of { name, ratePct }
    @Column(name = "discounts_json", columnDefinition = "text")
    private String discountsJson; // JSON array of { name, type, value }
    @Column(nullable = false)
    private Instant createdAt = Instant.now();
    @Column(nullable = false)
    private Instant updatedAt = Instant.now();

    @PreUpdate public void preUpdate(){ this.updatedAt = Instant.now(); }

    @Transient
    private String clientEmail; // not persisted; populated when returning API responses

    // getters/setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public String getNumber() { return number; }
    public void setNumber(String number) { this.number = number; }
    public UUID getClientId() { return clientId; }
    public void setClientId(UUID clientId) { this.clientId = clientId; }
    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }
    public LocalDate getIssueDate() { return issueDate; }
    public void setIssueDate(LocalDate issueDate) { this.issueDate = issueDate; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    public BigDecimal getTaxTotal() { return taxTotal; }
    public void setTaxTotal(BigDecimal taxTotal) { this.taxTotal = taxTotal; }
    public BigDecimal getDiscountTotal() { return discountTotal; }
    public void setDiscountTotal(BigDecimal discountTotal) { this.discountTotal = discountTotal; }
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getTaxesJson() { return taxesJson; }
    public void setTaxesJson(String taxesJson) { this.taxesJson = taxesJson; }
    public String getDiscountsJson() { return discountsJson; }
    public void setDiscountsJson(String discountsJson) { this.discountsJson = discountsJson; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public String getClientEmail() { return clientEmail; }
    public void setClientEmail(String clientEmail) { this.clientEmail = clientEmail; }
}
