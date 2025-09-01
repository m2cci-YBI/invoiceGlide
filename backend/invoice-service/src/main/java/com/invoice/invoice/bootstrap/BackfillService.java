package com.invoice.invoice.bootstrap;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.invoice.invoice.entity.InvoiceEntity;
import com.invoice.invoice.entity.InvoiceLineEntity;
import com.invoice.invoice.repo.InvoiceLineRepository;
import com.invoice.invoice.repo.InvoiceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class BackfillService {
    private static final Logger log = LoggerFactory.getLogger(BackfillService.class);
    private final InvoiceRepository invoices;
    private final InvoiceLineRepository lines;
    private final ObjectMapper om = new ObjectMapper();

    public BackfillService(InvoiceRepository invoices, InvoiceLineRepository lines) {
        this.invoices = invoices; this.lines = lines;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void backfill() {
        try {
            List<InvoiceEntity> all = invoices.findAll();
            for (InvoiceEntity inv : all) {
                // Ensure at least one line exists
                if (lines.findByInvoiceId(inv.getId()).isEmpty()) {
                    InvoiceLineEntity li = new InvoiceLineEntity();
                    li.setInvoiceId(inv.getId());
                    li.setDescription("Service");
                    li.setQty(new BigDecimal("1"));
                    li.setUnit("unit");
                    li.setUnitPrice(inv.getSubtotal());
                    li.setLineTotal(inv.getSubtotal());
                    lines.save(li);
                }
                if (inv.getTaxesJson() == null) inv.setTaxesJson("[]");
                if (inv.getDiscountsJson() == null) inv.setDiscountsJson("[]");
                invoices.save(inv);
            }
        } catch (Exception e) {
            log.warn("Backfill skipped: {}", e.getMessage());
        }
    }
}

