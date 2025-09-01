package com.invoice.invoice.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.invoice.invoice.entity.InvoiceSettingsEntity;
import com.invoice.invoice.repo.InvoiceSettingsRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/invoice/v1/settings")
public class SettingsController {
    private final InvoiceSettingsRepository repo;
    private final ObjectMapper om = new ObjectMapper();

    public SettingsController(InvoiceSettingsRepository repo) { this.repo = repo; }

    public record CompanySettings(
            String legalName,
            String taxId,
            String supportEmail,
            String legalFooter,
            String currency,
            String dateFormat,
            String numberFormat,
            String logoDataUrl,
            String invoiceNumberPrefix,
            Integer invoiceNumberCounter,
            Object templateTaxes,
            Object templateDiscounts,
            Object invoiceStyles,
            Object emailTemplates
    ){}

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<CompanySettings> get() throws Exception {
        UUID uid = AuthContext.userId();
        Optional<InvoiceSettingsEntity> opt = repo.findByUserId(uid);
        if (opt.isEmpty()) {
            // Provide sane defaults
            CompanySettings defaults = new CompanySettings(
                    "", "", "", "",
                    "CAD", "YYYY‑MM‑DD", "1,234.56", null,
                    "INV-{YYYY}-", 1,
                    om.readValue("[]", Object.class),
                    om.readValue("[]", Object.class),
                    om.readValue("{}", Object.class),
                    om.readValue("[]", Object.class)
            );
            return ResponseEntity.ok(defaults);
        }
        InvoiceSettingsEntity e = opt.get();
        return ResponseEntity.ok(new CompanySettings(
                nullIfEmpty(e.getLegalName()),
                nullIfEmpty(e.getTaxId()),
                nullIfEmpty(e.getSupportEmail()),
                nullIfEmpty(e.getLegalFooter()),
                orDefault(e.getCurrency(), "CAD"),
                orDefault(e.getDateFormat(), "YYYY‑MM‑DD"),
                orDefault(e.getNumberFormat(), "1,234.56"),
                e.getLogoDataUrl(),
                orDefault(e.getInvoiceNumberPrefix(), "INV-{YYYY}-"),
                e.getInvoiceNumberCounter() == null ? 1 : e.getInvoiceNumberCounter(),
                parseJsonOrEmpty(e.getTemplateTaxesJson(), true),
                parseJsonOrEmpty(e.getTemplateDiscountsJson(), true),
                parseJsonOrEmpty(e.getInvoiceStylesJson(), false),
                parseJsonOrEmpty(e.getEmailTemplatesJson(), true)
        ));
    }

    @PutMapping
    @Transactional
    public ResponseEntity<CompanySettings> upsert(@RequestBody CompanySettings body) throws Exception {
        UUID uid = AuthContext.userId();
        InvoiceSettingsEntity e = repo.findByUserId(uid).orElseGet(InvoiceSettingsEntity::new);
        e.setUserId(uid);
        e.setLegalName(body.legalName());
        e.setTaxId(body.taxId());
        e.setSupportEmail(body.supportEmail());
        e.setLegalFooter(body.legalFooter());
        e.setCurrency(body.currency());
        e.setDateFormat(body.dateFormat());
        e.setNumberFormat(body.numberFormat());
        e.setLogoDataUrl(body.logoDataUrl());
        e.setInvoiceNumberPrefix(body.invoiceNumberPrefix());
        e.setInvoiceNumberCounter(body.invoiceNumberCounter());
        e.setTemplateTaxesJson(body.templateTaxes()==null?null:om.writeValueAsString(body.templateTaxes()));
        e.setTemplateDiscountsJson(body.templateDiscounts()==null?null:om.writeValueAsString(body.templateDiscounts()));
        e.setInvoiceStylesJson(body.invoiceStyles()==null?null:om.writeValueAsString(body.invoiceStyles()));
        e.setEmailTemplatesJson(body.emailTemplates()==null?null:om.writeValueAsString(body.emailTemplates()));
        repo.save(e);
        return get();
    }

    private Object parseJsonOrEmpty(String raw, boolean array) throws Exception {
        if (raw == null || raw.isBlank()) return array ? om.readValue("[]", Object.class) : om.readValue("{}", Object.class);
        return om.readValue(raw, Object.class);
    }
    private String orDefault(String s, String d){ return (s==null||s.isBlank())?d:s; }
    private String nullIfEmpty(String s){ return (s==null||s.isBlank())?null:s; }
}