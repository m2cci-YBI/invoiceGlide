package com.invoice.mailing.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.invoice.mailing.api.RemindersController.ReminderRule;
import com.invoice.mailing.config.MailingProperties;
import com.invoice.mailing.db.MailSendEntity;
import com.invoice.mailing.db.MailSendRepository;
import com.invoice.mailing.db.ReminderRuleRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.TimeZone;

@Component
public class
ReminderScheduler {
    private final InvoiceClient invoiceClient;
    private final MailingProperties props;
    private final MailtrapApiSender apiSender;
    private final TemplateService templates;
    private final RemindersState state;
    private final MailSendRepository sends;
    private final ReminderRuleRepository ruleRepo;

    public ReminderScheduler(InvoiceClient invoiceClient, MailingProperties props, MailtrapApiSender apiSender, TemplateService templates, RemindersState state, MailSendRepository sends, ReminderRuleRepository ruleRepo) {
        this.invoiceClient = invoiceClient; this.props = props; this.apiSender = apiSender; this.templates = templates; this.state = state; this.sends = sends; this.ruleRepo = ruleRepo;
    }

    // rudimentary daily scan
    @Scheduled(cron = "0 15 6 * * *")
    public void runDaily() {
        List<ReminderRule> globalRules = state.getRules();
        if (globalRules == null || globalRules.isEmpty()) return;
        JsonNode[] list = invoiceClient.getInvoices();
        if (list == null) return;
        LocalDate today = LocalDate.now();
        for (JsonNode inv : list) {
            String status = inv.path("status").asText("");
            if ("COLLECTED".equals(status)) continue;
            String dueStr = inv.path("dueDate").asText("");
            if (dueStr == null || dueStr.isEmpty()) continue;
            LocalDate due;
            try { due = LocalDate.parse(dueStr); } catch (Exception e) { continue; }
            // Load per-client rules if any
            java.util.UUID clientId = null;
            try { clientId = java.util.UUID.fromString(inv.path("clientId").asText("")); } catch (Exception ignored) {}
            List<com.invoice.mailing.db.ReminderRuleEntity> scopedRules = ruleRepo.findByClientIdOrClientIdIsNullOrderByDaysAfterDueAsc(clientId);
            List<Integer> offsets = new ArrayList<>();
            if (scopedRules != null && !scopedRules.isEmpty()) {
                for (var r : scopedRules) if (r.isEnabled()) offsets.add(r.getDaysAfterDue());
            } else {
                for (var r : globalRules) if (r.enabled()) offsets.add(r.daysAfterDue());
            }
            for (int off : offsets) {
                LocalDate eventDate = due.plusDays(off);
                if (!eventDate.equals(today)) continue;
                // dedupe: has a SENT reminder for this invoice+date?
                java.util.UUID invoiceId = parseUuid(inv.path("id").asText(""));
                if (invoiceId == null) continue;
                long already = sends.countReminderSentFor(invoiceId, eventDate);
                if (already > 0) continue;
                String to = inv.path("clientEmail").asText("");
                if (to == null || to.isBlank()) continue;
                // build model
                java.util.Map<String,Object> model = new java.util.HashMap<>();
                model.put("company.name", "InvoiceGlide");
                model.put("company.email", "invoices@invoiceglide.com");
                model.put("invoice.number", inv.path("number").asText(""));
                model.put("invoice.total", inv.path("total").asText(""));
                model.put("invoice.dueDate", inv.path("dueDate").asText(""));
                String link = props.getAppBaseUrl() + "/api/invoice/v1/invoices/" + invoiceId + "/pdf";
                model.put("invoice.link", link);
                String subject = templates.renderSubject("TPL-REMINDER", model) + " [INV:" + invoiceId + "]";
                String html = templates.render("TPL-REMINDER", model);
                byte[] pdf = null;
                if (props.isAttachPdf()) {
                    try { pdf = invoiceClient.downloadPdf(invoiceId.toString()); } catch (Exception ignored) {}
                }
                try {
                    apiSender.sendHtml(to, subject, html, pdf, "invoice-" + inv.path("number").asText("invoice") + ".pdf");
                    MailSendEntity e = new MailSendEntity();
                    e.setInvoiceId(invoiceId); e.setClientId(clientId);
                    e.setToEmail(to); e.setSubject(subject); e.setTemplateId("TPL-REMINDER"); e.setTemplateType("REMINDER");
                    e.setChannel("API"); e.setStatus("SENT"); e.setRuleOffset(off); e.setEventDate(eventDate);
                    e.setCreatedAt(OffsetDateTime.now()); e.setUpdatedAt(OffsetDateTime.now());
                    sends.save(e);
                } catch (Exception ex) {
                    MailSendEntity e = new MailSendEntity();
                    e.setInvoiceId(invoiceId); e.setClientId(clientId);
                    e.setToEmail(to); e.setSubject(subject); e.setTemplateId("TPL-REMINDER"); e.setTemplateType("REMINDER");
                    e.setChannel("API"); e.setStatus("FAILED"); e.setRuleOffset(off); e.setEventDate(eventDate); e.setErrorMsg(ex.getMessage());
                    e.setCreatedAt(OffsetDateTime.now()); e.setUpdatedAt(OffsetDateTime.now());
                    sends.save(e);
                }
            }
        }
    }

    private java.util.UUID parseUuid(String s) { try { return java.util.UUID.fromString(s); } catch (Exception e) { return null; } }
}
