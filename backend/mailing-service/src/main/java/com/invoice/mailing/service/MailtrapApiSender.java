package com.invoice.mailing.service;

import com.invoice.mailing.config.MailingProperties;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class MailtrapApiSender {
    private final MailingProperties props;
    private final RestClient http;

    public MailtrapApiSender(MailingProperties props) {
        this.props = props;
        this.http = RestClient.builder().build();
    }

    public String sendHtml(String to, String subject, String html, byte[] pdf, String pdfName) {
        String token = props.getMailtrapApiToken();
        if (token == null || token.isBlank()) {
            throw new IllegalStateException("MAILTRAP_API_TOKEN is not set");
        }
        Map<String, Object> body = new HashMap<>();
        body.put("from", Map.of("email", props.getFrom(), "name", "InvoiceGlide"));
        body.put("to", List.of(Map.of("email", to)));
        body.put("subject", subject);
        body.put("html", html);
        body.put("category", "Invoice");
        if (pdf != null && pdf.length > 0) {
            String b64 = Base64.getEncoder().encodeToString(pdf);
            Map<String,Object> att = new HashMap<>();
            att.put("content", b64);
            att.put("filename", pdfName != null ? pdfName : "invoice.pdf");
            att.put("type", "application/pdf");
            body.put("attachments", List.of(att));
        }

        return http.post()
                .uri(props.getMailtrapApiUrl())
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(String.class);
    }
}

