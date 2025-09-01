package com.invoice.invoice.web;

import com.invoice.invoice.entity.InvoiceEntity;
import com.invoice.invoice.entity.InvoiceLineEntity;
import com.invoice.invoice.repo.ClientRepository;
import com.invoice.invoice.repo.InvoiceLineRepository;
import com.invoice.invoice.repo.InvoiceRepository;
import com.invoice.invoice.repo.InvoiceSettingsRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.io.OutputStream;
import java.math.BigDecimal;
import java.net.URI;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/invoice/v1/invoices")
public class InvoicesController {
    private final InvoiceRepository invoices;
    private final InvoiceLineRepository lines;
    private final ClientRepository clients;
    private final InvoiceSettingsRepository settingsRepo;
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(InvoicesController.class);

    public InvoicesController(InvoiceRepository invoices, InvoiceLineRepository lines, ClientRepository clients, InvoiceSettingsRepository settingsRepo) {
        this.invoices = invoices;
        this.lines = lines;
        this.clients = clients;
        this.settingsRepo = settingsRepo;
    }

    @GetMapping
    public ResponseEntity<List<InvoiceEntity>> list(@RequestParam(name = "status", required = false) String status,
                                                    @RequestParam(name = "query", required = false) String query) {
        UUID uid = AuthContext.userId();
        List<InvoiceEntity> all = (status == null || status.isBlank())
                ? invoices.findByUserIdOrderByIssueDateDesc(uid)
                : invoices.findByUserIdAndStatusOrderByIssueDateDesc(uid, status.toUpperCase());
        if (query == null || query.isBlank()) return ResponseEntity.ok(all);
        String q = query.toLowerCase();
        return ResponseEntity.ok(all.stream().filter(i ->
                (i.getNumber() != null && i.getNumber().toLowerCase().contains(q)) ||
                        (i.getClientName() != null && i.getClientName().toLowerCase().contains(q))
        ).toList());
    }

    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<InvoiceEntity> get(@PathVariable("id") UUID id) {
        UUID uid = AuthContext.userId();
        return invoices.findByIdAndUserId(id, uid)
                .map(inv -> {
                    clients.findById(inv.getClientId()).ifPresent(c -> inv.setClientEmail(c.getEmail()));
                    return ResponseEntity.ok(inv);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    public record LineDto(String description, BigDecimal qty, String unit, BigDecimal unitPrice) {}

    public record TaxDto(String name, BigDecimal ratePct) {}

    public record DiscountDto(String name, String type, BigDecimal value) {}

    public record CreateInvoiceRequest(UUID clientId, String issueDate, String dueDate, String currency,
                                       List<LineDto> lines,
                                       List<TaxDto> invoiceTaxes,
                                       List<DiscountDto> invoiceDiscounts) {}

    @PostMapping
    @Transactional
    public ResponseEntity<InvoiceEntity> create(@RequestBody CreateInvoiceRequest req) {
        UUID uid = AuthContext.userId();
        var client = clients.findById(req.clientId()).orElseThrow();
        if (!client.getUserId().equals(uid)) return ResponseEntity.badRequest().build();
        BigDecimal subtotal = BigDecimal.ZERO;
        for (var l : req.lines()) {
            BigDecimal lineTotal = (l.qty() == null ? BigDecimal.ZERO : l.qty()).multiply(l.unitPrice() == null ? BigDecimal.ZERO : l.unitPrice());
            subtotal = subtotal.add(lineTotal);
        }
        BigDecimal tax = BigDecimal.ZERO;
        if (req.invoiceTaxes() != null) {
            for (var t : req.invoiceTaxes()) {
                BigDecimal rate = t.ratePct() == null ? BigDecimal.ZERO : t.ratePct();
                BigDecimal taxAmt = subtotal.multiply(rate).movePointLeft(2);
                tax = tax.add(taxAmt);
            }
        }
        BigDecimal preDiscount = subtotal.add(tax);
        BigDecimal discount = BigDecimal.ZERO;
        if (req.invoiceDiscounts() != null) {
            for (var d : req.invoiceDiscounts()) {
                if (d == null) continue;
                String type = d.type() == null ? "percent" : d.type().toLowerCase();
                BigDecimal v = d.value() == null ? BigDecimal.ZERO : d.value();
                BigDecimal amt = switch (type) {
                    case "amount" -> v;
                    default -> preDiscount.multiply(v).movePointLeft(2);
                };
                discount = discount.add(amt);
            }
        }
        if (discount.compareTo(preDiscount) > 0) discount = preDiscount; // guard
        BigDecimal total = preDiscount.subtract(discount);
        InvoiceEntity inv = new InvoiceEntity();
        inv.setUserId(uid);
        inv.setClientId(client.getId());
        inv.setClientName(client.getName());
        inv.setIssueDate(LocalDate.parse(req.issueDate()));
        inv.setDueDate(LocalDate.parse(req.dueDate()));
        inv.setCurrency(req.currency());
        inv.setSubtotal(subtotal);
        inv.setTaxTotal(tax);
        inv.setDiscountTotal(discount);
        inv.setTotal(total);
        inv.setStatus("OPEN");
        try {
            var om = new com.fasterxml.jackson.databind.ObjectMapper();
            inv.setTaxesJson(req.invoiceTaxes() == null ? null : om.writeValueAsString(req.invoiceTaxes()));
            inv.setDiscountsJson(req.invoiceDiscounts() == null ? null : om.writeValueAsString(req.invoiceDiscounts()));
        } catch (Exception ignored) {}
        var optSettings = settingsRepo.findByUserId(uid);
        String prefix = optSettings.map(s -> s.getInvoiceNumberPrefix()).orElse("INV-{YYYY}-");
        Integer counter = optSettings.map(s -> s.getInvoiceNumberCounter()).orElse(1);
        String number = (prefix == null || prefix.isBlank() ? "INV-{YYYY}-" : prefix)
                .replace("{YYYY}", String.valueOf(inv.getIssueDate().getYear()))
                + (counter == null ? 1 : counter);
        inv.setNumber(number);
        InvoiceEntity saved = invoices.save(inv);
        if (optSettings.isPresent()) {
            var s = optSettings.get();
            s.setInvoiceNumberCounter((counter == null ? 1 : counter) + 1);
            settingsRepo.save(s);
        } else {
            var s = new com.invoice.invoice.entity.InvoiceSettingsEntity();
            s.setUserId(uid);
            s.setInvoiceNumberPrefix(prefix);
            s.setInvoiceNumberCounter((counter == null ? 1 : counter) + 1);
            settingsRepo.save(s);
        }
        for (var l : req.lines()) {
            InvoiceLineEntity line = new InvoiceLineEntity();
            line.setInvoiceId(saved.getId());
            line.setDescription(l.description());
            line.setQty(l.qty());
            line.setUnit(l.unit());
            line.setUnitPrice(l.unitPrice());
            line.setLineTotal((l.qty() == null ? BigDecimal.ZERO : l.qty()).multiply(l.unitPrice() == null ? BigDecimal.ZERO : l.unitPrice()));
            lines.save(line);
        }
        return ResponseEntity.created(URI.create("/api/invoice/v1/invoices/" + saved.getId())).body(saved);
    }

    public record StatusChangeRequest(String status) {}

    @PostMapping("/{id}/status")
    public ResponseEntity<Void> changeStatus(@PathVariable("id") UUID id, @RequestBody StatusChangeRequest req) {
        UUID uid = AuthContext.userId();
        InvoiceEntity inv = invoices.findById(id).orElseThrow();
        if (!inv.getUserId().equals(uid)) return ResponseEntity.notFound().build();
        inv.setStatus(req.status().toUpperCase());
        invoices.save(inv);
        return ResponseEntity.ok().build();
    }

    @GetMapping(value = "/{id}/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    @Transactional(readOnly = true)
    public org.springframework.http.ResponseEntity<byte[]> pdf(@PathVariable("id") UUID id) throws Exception {
        UUID uid = AuthContext.userIdOrNull();
        var invOpt = (uid != null) ? invoices.findByIdAndUserId(id, uid) : invoices.findById(id);
        if (invOpt.isEmpty()) {
            return org.springframework.http.ResponseEntity.notFound().build();
        }
        InvoiceEntity inv = invOpt.get();
        var invLines = lines.findByInvoiceId(inv.getId());
        var optSettings = settingsRepo.findByUserId(inv.getUserId());
        String html = renderInvoiceHtml(inv, invLines, optSettings.orElse(null));
        var renderer = new com.openhtmltopdf.pdfboxout.PdfRendererBuilder();
        renderer.withHtmlContent(html, null);
        java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream(32 * 1024);
        boolean fallback = false;
        try {
            renderer.toStream(baos).run();
        } catch (Exception ex) {
            fallback = true;
            log.error("HTML->PDF render failed for invoice {}: {} (htmlLength={})", inv.getId(), ex.toString(), html == null ? 0 : html.length(), ex);
            // Fallback: generate a minimal PDF so downloads still work
            try {
                org.apache.pdfbox.pdmodel.PDDocument doc = new org.apache.pdfbox.pdmodel.PDDocument();
                org.apache.pdfbox.pdmodel.PDPage page = new org.apache.pdfbox.pdmodel.PDPage();
                doc.addPage(page);
                org.apache.pdfbox.pdmodel.PDPageContentStream cs = new org.apache.pdfbox.pdmodel.PDPageContentStream(doc, page);
                cs.beginText();
                cs.setFont(org.apache.pdfbox.pdmodel.font.PDType1Font.HELVETICA_BOLD, 16);
                cs.newLineAtOffset(72, 720);
                cs.showText("Invoice " + inv.getNumber() + " - Total: " + totalString(inv));
                cs.endText();
                cs.close();
                doc.save(baos);
                doc.close();
            } catch (Exception ex2) {
                log.error("Fallback PDF generation failed for invoice {}: {}", inv.getId(), ex2.toString(), ex2);
            }
        }
        byte[] bytes = baos.toByteArray();
        String filename = "invoice-" + inv.getNumber() + ".pdf";
        return org.springframework.http.ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header("Content-Disposition", "inline; filename=" + filename)
                .header("X-Render", fallback ? "fallback" : "ok")
                .contentLength(bytes.length)
                .body(bytes);
    }

    private String totalString(InvoiceEntity inv) {
        java.math.BigDecimal t = inv.getTotal() == null ? java.math.BigDecimal.ZERO : inv.getTotal();
        return t.stripTrailingZeros().toPlainString() + " " + (inv.getCurrency() == null ? "" : inv.getCurrency());
    }

    private String renderInvoiceHtml(InvoiceEntity inv, java.util.List<InvoiceLineEntity> invLines, com.invoice.invoice.entity.InvoiceSettingsEntity settings) {
        String companyName = settings != null && settings.getLegalName() != null ? settings.getLegalName() : "Your Company";
        String supportEmail = settings != null ? settings.getSupportEmail() : null;
        String legalFooter = settings != null ? settings.getLegalFooter() : null;

        java.time.format.DateTimeFormatter df = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String currency = inv.getCurrency() == null ? "USD" : inv.getCurrency();

        java.math.BigDecimal subtotal = inv.getSubtotal() == null ? java.math.BigDecimal.ZERO : inv.getSubtotal();
        java.math.BigDecimal taxTotal = inv.getTaxTotal() == null ? java.math.BigDecimal.ZERO : inv.getTaxTotal();
        java.math.BigDecimal discountTotal = inv.getDiscountTotal() == null ? java.math.BigDecimal.ZERO : inv.getDiscountTotal();
        java.math.BigDecimal total = inv.getTotal() == null ? subtotal.add(taxTotal).subtract(discountTotal) : inv.getTotal();

        // Parse taxes and discounts for per-line summary rows
        java.util.List<java.util.Map<String,Object>> taxes = new java.util.ArrayList<>();
        java.util.List<java.util.Map<String,Object>> discounts = new java.util.ArrayList<>();
        com.fasterxml.jackson.databind.ObjectMapper om = new com.fasterxml.jackson.databind.ObjectMapper();
        try {
            if (inv.getTaxesJson() != null) {
                java.util.List<?> list = om.readValue(inv.getTaxesJson(), java.util.List.class);
                for (Object o : list) if (o instanceof java.util.Map<?,?> m) taxes.add((java.util.Map<String,Object>) m);
            }
        } catch (Exception ignored) {}
        try {
            if (inv.getDiscountsJson() != null) {
                java.util.List<?> list = om.readValue(inv.getDiscountsJson(), java.util.List.class);
                for (Object o : list) if (o instanceof java.util.Map<?,?> m) discounts.add((java.util.Map<String,Object>) m);
            }
        } catch (Exception ignored) {}

        StringBuilder sb = new StringBuilder();
        sb.append("<!DOCTYPE html><html><head>");
        sb.append("<style>")
          .append("body{font-family:Arial,Helvetica,sans-serif;color:#111827;background:#fff;margin:24px;}")
          .append(".muted{color:#6B7280;font-size:12px}")
          .append(".h1{font-size:20px;font-weight:600}")
          .append("table{border-collapse:collapse;width:100%}")
          .append("th,td{font-size:12px;padding:8px;vertical-align:top}")
          .append("thead{background:#F8FAFC;color:#6B7280;text-align:left}")
          .append(".right{text-align:right}")
          .append(".border{border:1px solid #E5E7EB}")
          .append(".border-top{border-top:1px solid #E5E7EB}")
          .append("</style></head><body>");

        // Header (table-based)
        sb.append("<table><tr>")
          .append("<td>")
          .append("<div class='h1'>").append(escape(companyName)).append("</div>")
          .append(supportEmail != null && !supportEmail.isBlank() ? ("<div class='muted'>" + escape(supportEmail) + "</div>") : "")
          .append("</td>")
          .append("<td class='right'>")
          .append("<div style='letter-spacing:1px;font-size:13px'>INVOICE</div>")
          .append("<div class='h1'>").append(escape(nullTo(inv.getNumber(), "-"))).append("</div>")
          .append("</td>")
          .append("</tr></table>");

        // Meta (table-based)
        sb.append("<table style='margin-top:8px'>")
          .append("<tr>")
          .append("<td><div class='muted'>Issue date</div>")
          .append("<div>").append(escape(inv.getIssueDate() == null ? "" : inv.getIssueDate().format(df))).append("</div></td>")
          .append("<td><div class='muted'>Due date</div>")
          .append("<div>").append(escape(inv.getDueDate() == null ? "" : inv.getDueDate().format(df))).append("</div></td>")
          .append("</tr>")
          .append("<tr><td colspan='2'><div class='muted'>Bill To</div>")
          .append("<div style='font-weight:500'>").append(escape(nullTo(inv.getClientName(), ""))).append("</div>");
        try { clients.findById(inv.getClientId()).ifPresent(c -> sb.append("<div class='muted'>").append(escape(nullTo(c.getEmail(), ""))).append("</div>")); } catch (Exception ignored) {}
        sb.append("</td></tr></table>");

        // Lines
        sb.append("<table class='border' style='margin-top:12px'><thead><tr>")
          .append("<th style='width:40%'>Description</th>")
          .append("<th style='width:10%'>Qty</th>")
          .append("<th style='width:10%'>Unit</th>")
          .append("<th style='width:20%'>Unit Price</th>")
          .append("<th class='right' style='width:20%'>Line Total</th>")
          .append("</tr></thead><tbody>");
        if (invLines != null) {
            for (InvoiceLineEntity l : invLines) {
                sb.append("<tr class='border-top'>")
                  .append("<td>").append(escape(nullTo(l.getDescription(), ""))).append("</td>")
                  .append("<td>").append(escape(num(l.getQty()))).append("</td>")
                  .append("<td>").append(escape(nullTo(l.getUnit(), ""))).append("</td>")
                  .append("<td>").append(escape(money(l.getUnitPrice(), currency))).append("</td>")
                  .append("<td class='right'>").append(escape(money(l.getLineTotal(), currency))).append("</td>")
                  .append("</tr>");
            }
        }
        sb.append("</tbody></table>");

        // Summary (table-based)
        sb.append("<table style='margin-top:12px'><tr>")
          .append("<td style='width:50%'></td>")
          .append("<td class='border' style='width:50%'>");
        sb.append(row("Subtotal", money(subtotal, currency)));
        java.math.BigDecimal computedTax = java.math.BigDecimal.ZERO;
        for (var t : taxes) {
            String name = String.valueOf(t.getOrDefault("name", "Tax"));
            java.math.BigDecimal rate = bd(t.get("ratePct"));
            java.math.BigDecimal amt = subtotal.multiply(rate).movePointLeft(2);
            computedTax = computedTax.add(amt);
            sb.append(row(name + " (" + rate.stripTrailingZeros().toPlainString() + "%)", money(amt, currency)));
        }
        sb.append(row("Tax", money(taxTotal.compareTo(java.math.BigDecimal.ZERO) > 0 ? taxTotal : computedTax, currency)));
        java.math.BigDecimal preDiscount = subtotal.add(taxTotal.compareTo(java.math.BigDecimal.ZERO) > 0 ? taxTotal : computedTax);
        java.math.BigDecimal discSum = java.math.BigDecimal.ZERO;
        for (var d : discounts) {
            String name = String.valueOf(d.getOrDefault("name", "Discount"));
            String type = String.valueOf(d.getOrDefault("type", "percent")).toLowerCase();
            java.math.BigDecimal val = bd(d.get("value"));
            java.math.BigDecimal amt = "amount".equals(type) ? val : preDiscount.multiply(val).movePointLeft(2);
            discSum = discSum.add(amt);
            sb.append(row(name, "-" + money(amt, currency)));
        }
        if (discSum.compareTo(java.math.BigDecimal.ZERO) > 0) sb.append(row("Discounts total", "-" + money(discSum, currency)));
        sb.append("<table style='width:100%'><tr class='border-top'><td>" + escape("Total") + "</td><td class='right' style='font-weight:600'>" + escape(money(total, currency)) + "</td></tr></table>");
        sb.append("</td></tr></table>");

        if (legalFooter != null && !legalFooter.isBlank()) {
            sb.append("<div class='muted' style='margin-top:16px;white-space:pre-wrap'>").append(escape(legalFooter)).append("</div>");
        }

        sb.append("</body></html>");
        return sb.toString();
    }

    private String row(String label, String value) {
        return "<table style='width:100%'><tr><td>" + escape(label) + "</td><td class='right'>" + escape(value) + "</td></tr></table>";
    }
    private String escape(String s) { return s == null ? "" : s.replace("&","&amp;").replace("<","&lt;").replace(">", "&gt;"); }
    private String nullTo(String s, String d) { return s == null ? d : s; }
    private String money(java.math.BigDecimal v, String currency) {
        java.math.BigDecimal n = v == null ? java.math.BigDecimal.ZERO : v;
        java.text.NumberFormat f = java.text.NumberFormat.getCurrencyInstance(java.util.Locale.US);
        try {
            java.util.Currency c = java.util.Currency.getInstance(currency);
            f.setCurrency(c);
        } catch (Exception ignored) {}
        return f.format(n);
    }
    private String num(java.math.BigDecimal v) { return v == null ? "" : v.stripTrailingZeros().toPlainString(); }
    private java.math.BigDecimal bd(Object o) {
        if (o == null) return java.math.BigDecimal.ZERO;
        try { return new java.math.BigDecimal(String.valueOf(o)); } catch (Exception e) { return java.math.BigDecimal.ZERO; }
    }
}