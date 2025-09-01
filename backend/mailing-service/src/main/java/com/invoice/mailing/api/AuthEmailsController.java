package com.invoice.mailing.api;

import com.invoice.mailing.config.MailingProperties;
import com.invoice.mailing.service.TemplateService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(path = "/api/mail/v1/email", produces = MediaType.APPLICATION_JSON_VALUE)
public class AuthEmailsController {
    private final TemplateService templates;
    private final MailingProperties props;
    private final java.util.Optional<com.invoice.mailing.service.SmtpSender> smtp;
    private final com.invoice.mailing.service.MailtrapApiSender apiSender;

    public AuthEmailsController(TemplateService templates,
                                MailingProperties props,
                                java.util.Optional<com.invoice.mailing.service.SmtpSender> smtp,
                                com.invoice.mailing.service.MailtrapApiSender apiSender) {
        this.templates = templates; this.props = props; this.smtp = smtp; this.apiSender = apiSender;
    }

    public record SimpleEmail(String email, String name, String url) {}

    @PostMapping("/confirmation")
    public Map<String, String> sendConfirmation(@RequestBody SimpleEmail req) throws Exception {
        Map<String,Object> model = new HashMap<>();
        model.put("company.name", "InvoiceGlide");
        model.put("company.email", props.getFrom());
        model.put("user.name", safe(req.name()));
        model.put("action.url", safe(req.url()));
        String subject = templates.renderSubject("TPL-CONFIRMATION", model);
        String html = templates.render("TPL-CONFIRMATION", model);
        sender().sendHtml(req.email(), subject, html, null, null);
        return Map.of("status", "SENT");
    }

    @PostMapping("/password-reset")
    public Map<String, String> sendPasswordReset(@RequestBody SimpleEmail req) throws Exception {
        Map<String,Object> model = new HashMap<>();
        model.put("company.name", "InvoiceGlide");
        model.put("company.email", props.getFrom());
        model.put("user.name", safe(req.name()));
        model.put("action.url", safe(req.url()));
        String subject = templates.renderSubject("TPL-PASSWORD-RESET", model);
        String html = templates.render("TPL-PASSWORD-RESET", model);
        sender().sendHtml(req.email(), subject, html, null, null);
        return Map.of("status", "SENT");
    }

    private String safe(String s) { return s == null ? "" : s; }

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

