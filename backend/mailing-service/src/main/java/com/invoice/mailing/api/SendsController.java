package com.invoice.mailing.api;

import com.invoice.mailing.db.MailSendEntity;
import com.invoice.mailing.db.MailSendRepository;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping(path = "/api/mail/v1", produces = MediaType.APPLICATION_JSON_VALUE)
public class SendsController {
    private final MailSendRepository repo;

    public SendsController(MailSendRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/sends")
    public List<Map<String, Object>> list(
            @RequestParam(value = "invoiceId", required = false) UUID invoiceId
    ) {
        List<MailSendEntity> items = invoiceId != null
                ? repo.findTop50ByInvoiceIdOrderByCreatedAtDesc(invoiceId)
                : repo.findTop50ByOrderByCreatedAtDesc();
        return items.stream().map(this::toDto).toList();
    }

    private Map<String, Object> toDto(MailSendEntity e) {
        return Map.of(
                "id", e.getId(),
                "createdAt", e.getCreatedAt(),
                "to", e.getToEmail(),
                "subject", e.getSubject(),
                "templateType", e.getTemplateType(),
                "status", e.getStatus(),
                "providerMsgId", e.getProviderMsgId(),
                "errorMsg", e.getErrorMsg(),
                "invoiceId", e.getInvoiceId(),
                "clientId", e.getClientId()
        );
    }
}

