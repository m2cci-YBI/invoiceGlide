package com.invoice.invoice.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "inv_invoice_lines")
public class InvoiceLineEntity {
    @Id @GeneratedValue
    private UUID id;
    @Column(nullable = false)
    private UUID invoiceId;
    private String description;
    private BigDecimal qty;
    private String unit;
    private BigDecimal unitPrice;
    private BigDecimal lineTotal;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getInvoiceId() { return invoiceId; }
    public void setInvoiceId(UUID invoiceId) { this.invoiceId = invoiceId; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getQty() { return qty; }
    public void setQty(BigDecimal qty) { this.qty = qty; }
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    public BigDecimal getLineTotal() { return lineTotal; }
    public void setLineTotal(BigDecimal lineTotal) { this.lineTotal = lineTotal; }
}

