package com.invoice.mailing.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.invoice.mailing.api.dto.SendInvoiceRequest;
import com.invoice.mailing.api.dto.SendResponse;
import com.invoice.mailing.api.dto.SendTestRequest;
import com.invoice.mailing.api.dto.SendReminderRequest;
import com.invoice.mailing.config.MailingProperties;
import com.invoice.mailing.service.InvoiceClient;
import com.invoice.mailing.service.SmtpSender;
import com.invoice.mailing.service.TemplateService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping(path = "/api/mail/v1", produces = MediaType.APPLICATION_JSON_VALUE)
public class MailSendController {
    private final TemplateService templates;
    private final java.util.Optional<SmtpSender> smtp;
    private final com.invoice.mailing.service.MailtrapApiSender apiSender;
    private final InvoiceClient invoiceClient;
    private final MailingProperties props;

    public MailSendController(TemplateService templates, java.util.Optional<SmtpSender> smtp, InvoiceClient invoiceClient, MailingProperties props, com.invoice.mailing.service.MailtrapApiSender apiSender) {
        this.templates = templates; this.smtp = smtp; this.invoiceClient = invoiceClient; this.props = props; this.apiSender = apiSender;
    }

    @PostMapping("/send/test")
    public SendResponse sendTest(@Valid @RequestBody SendTestRequest req) throws Exception {
        Map<String,Object> model = baseModel();
        String tpl = req.getTemplateId() != null ? req.getTemplateId() : "TPL-INVOICE";
        String html = templates.render(tpl, model);
        String subject = templates.renderSubject(tpl, model);
        try {
            sender().sendHtml(req.getTo(), subject, html, null, null);
            auditSend(null, null, req.getTo(), subject, tpl, guessType(tpl), "SENT", null, null);
            return new SendResponse(UUID.randomUUID().toString(), "SENT");
        } catch (Exception ex) {
            auditSend(null, null, req.getTo(), subject, tpl, guessType(tpl), "FAILED", null, ex.getMessage());
            throw ex;
        }
    }

    @PostMapping("/send/invoice")
    public SendResponse sendInvoice(@Valid @RequestBody SendInvoiceRequest req, @RequestHeader("Authorization") String authHeader) throws Exception {
        JsonNode inv = invoiceClient.getInvoice(req.getInvoiceId(), authHeader);
        String to = (req.getTo() != null && !req.getTo().isBlank()) ? req.getTo() : inv.path("clientEmail").asText("");
        if (to == null || to.isBlank()) {
            String clientId = inv.path("clientId").asText("");
            if (clientId != null && !clientId.isBlank()) {
                try { to = invoiceClient.getClient(clientId, authHeader).path("email").asText(""); } catch (Exception ignored) {}
            }
        }
        if (to == null || to.isBlank()) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "Missing recipient email");
        }
        Map<String,Object> model = baseModel();
        model.put("invoice.number", inv.path("number").asText(""));
        model.put("invoice.total", inv.path("total").asText(""));
        String link = props.getAppBaseUrl() + "/api/invoice/v1/invoices/" + req.getInvoiceId() + "/pdf";
        model.put("invoice.link", link);
        model.put("client.name", inv.path("clientName").asText("Customer"));

        String subject = templates.renderSubject("TPL-INVOICE", model) + " [INV:" + req.getInvoiceId() + "]";
        String html = templates.render("TPL-INVOICE", model);

        byte[] pdf = null;
        if (props.isAttachPdf()) {
            try { pdf = invoiceClient.downloadPdf(req.getInvoiceId(), authHeader); } catch (Exception ignored) {}
        }
        try {
            sender().sendHtml(to, subject, html, pdf, "invoice-" + inv.path("number").asText("invoice") + ".pdf");
            auditSend(parseUuidSafe(req.getInvoiceId()), null, to, subject, "TPL-INVOICE", "INVOICE", "SENT", null, null);
            return new SendResponse(UUID.randomUUID().toString(), "SENT");
        } catch (Exception ex) {
            auditSend(parseUuidSafe(req.getInvoiceId()), null, to, subject, "TPL-INVOICE", "INVOICE", "FAILED", null, ex.getMessage());
            throw ex;
        }
    }

    @PostMapping("/send/reminder")
    public SendResponse sendReminder(@Valid @RequestBody SendReminderRequest req, @RequestHeader("Authorization") String authHeader) throws Exception {
        JsonNode inv = invoiceClient.getInvoice(req.getInvoiceId(), authHeader);
        String to = (req.getTo() != null && !req.getTo().isBlank()) ? req.getTo() : inv.path("clientEmail").asText("");
        if (to == null || to.isBlank()) {
            String clientId = inv.path("clientId").asText("");
            if (clientId != null && !clientId.isBlank()) {
                try { to = invoiceClient.getClient(clientId, authHeader).path("email").asText(""); } catch (Exception ignored) {}
            }
        }
        if (to == null || to.isBlank()) {
            throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "Missing recipient email");
        }
        Map<String,Object> model = baseModel();
        model.put("invoice.number", inv.path("number").asText(""));
        model.put("invoice.total", inv.path("total").asText(""));
        model.put("invoice.dueDate", inv.path("dueDate").asText(""));
        String link = props.getAppBaseUrl() + "/api/invoice/v1/invoices/" + req.getInvoiceId() + "/pdf";
        model.put("invoice.link", link);
        model.put("client.name", inv.path("clientName").asText("Customer"));

        String subject = templates.renderSubject("TPL-REMINDER", model) + " [INV:" + req.getInvoiceId() + "]";
        String html = templates.render("TPL-REMINDER", model);

        byte[] pdf = null;
        if (props.isAttachPdf()) {
            try { pdf = invoiceClient.downloadPdf(req.getInvoiceId(), authHeader); } catch (Exception ignored) {}
        }
        try {
            sender().sendHtml(to, subject, html, pdf, "invoice-" + inv.path("number").asText("invoice") + ".pdf");
            auditSend(parseUuidSafe(req.getInvoiceId()), null, to, subject, "TPL-REMINDER", "REMINDER", "SENT", null, null);
            return new SendResponse(UUID.randomUUID().toString(), "SENT");
        } catch (Exception ex) {
            auditSend(parseUuidSafe(req.getInvoiceId()), null, to, subject, "TPL-REMINDER", "REMINDER", "FAILED", null, ex.getMessage());
            throw ex;
        }
    }

    private Map<String,Object> baseModel() {
        Map<String,Object> m = new HashMap<>();
        m.put("company.name", "InvoiceGlide");
        m.put("company.email", "invoices@invoiceglide.com");
        return m;
    }

    @org.springframework.beans.factory.annotation.Autowired
    private com.invoice.mailing.db.MailSendRepository mailSendRepository;

    private void auditSend(java.util.UUID invoiceId, java.util.UUID clientId, String to, String subject,
                           String templateId, String templateType, String status, String providerMsgId, String errorMsg) {
        com.invoice.mailing.db.MailSendEntity e = new com.invoice.mailing.db.MailSendEntity();
        e.setInvoiceId(invoiceId); e.setClientId(clientId);
        e.setToEmail(to); e.setSubject(subject); e.setTemplateId(templateId); e.setTemplateType(templateType);
        e.setChannel("API"); e.setStatus(status); e.setProviderMsgId(providerMsgId); e.setErrorMsg(errorMsg);
        java.time.OffsetDateTime now = java.time.OffsetDateTime.now(); e.setCreatedAt(now); e.setUpdatedAt(now);
        mailSendRepository.save(e);
    }

    private String guessType(String tplId) {
        if (tplId != null && tplId.contains("REMINDER")) return "REMINDER";
        if (tplId != null && tplId.contains("RECEIPT")) return "RECEIPT";
        return "INVOICE";
    }

    private java.util.UUID parseUuidSafe(String s) { try { return java.util.UUID.fromString(s); } catch (Exception ignored) { return null; } }

    private Sender sender() {
        if (props.getMailtrapApiToken() != null && !props.getMailtrapApiToken().isBlank()) {
            return apiSender::sendHtml;
        }
        return smtp.orElseThrow(() -> new IllegalStateException("No SMTP sender configured"))::sendHtml;
    }

    @FunctionalInterface
    private interface Sender {
        String sendHtml(String to, String subject, String html, byte[] pdf, String pdfName) throws Exception;
    }
}
