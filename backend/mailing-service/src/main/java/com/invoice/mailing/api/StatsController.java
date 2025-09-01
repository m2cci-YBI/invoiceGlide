package com.invoice.mailing.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.invoice.mailing.db.MailSendRepository;
import com.invoice.mailing.service.InvoiceClient;
import com.invoice.mailing.service.RemindersState;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.*;

@RestController
@RequestMapping(path = "/api/mail/v1/stats", produces = MediaType.APPLICATION_JSON_VALUE)
public class StatsController {
    private final MailSendRepository sends;
    private final InvoiceClient invoices;
    private final RemindersState state;

    public StatsController(MailSendRepository sends, InvoiceClient invoices, RemindersState state) {
        this.sends = sends; this.invoices = invoices; this.state = state;
    }

    @GetMapping("/reminders")
    public Map<String, Object> reminders(@RequestParam(value = "windowDays", required = false, defaultValue = "7") int windowDays, @RequestHeader("Authorization") String authHeader) {
        OffsetDateTime since = OffsetDateTime.now(ZoneOffset.UTC).minusDays(windowDays);
        long sentLast = 0;
        // Scheduled next N days (approximate): fetch all invoices and apply rules, similar to UI heuristic
        int scheduledNext = 0;
        try {
            // This assumes invoice list endpoint exists; if not, keep 0
            java.util.List<JsonNode> invList = Arrays.asList(Objects.requireNonNull(invoices.getInvoices(authHeader)));
            java.util.List<java.util.UUID> myInvoiceIds = new java.util.ArrayList<>();
            for (JsonNode inv : invList) {
                String id = inv.path("id").asText("");
                try { if (!id.isBlank()) myInvoiceIds.add(java.util.UUID.fromString(id)); } catch (Exception ignored) {}
            }
            if (!myInvoiceIds.isEmpty()) {
                sentLast = sends.countRemindersSentSinceForInvoices(since, myInvoiceIds);
            }
            java.time.LocalDate start = java.time.LocalDate.now();
            java.time.LocalDate end = start.plusDays(windowDays);
            List<Integer> offs = new ArrayList<>();
            state.getRules().forEach(r -> { if (r.enabled()) offs.add(r.daysAfterDue()); });
            for (JsonNode inv : invList) {
                String status = inv.path("status").asText(""); if ("COLLECTED".equals(status)) continue;
                String dueStr = inv.path("dueDate").asText(""); if (dueStr == null || dueStr.isEmpty()) continue;
                java.time.LocalDate due;
                try { due = java.time.LocalDate.parse(dueStr); } catch (Exception e) { continue; }
                for (int off : offs) {
                    java.time.LocalDate evt = due.plusDays(off);
                    if (!evt.isBefore(start) && evt.isBefore(end)) scheduledNext++;
                }
            }
        } catch (Exception ignored) {}
        return Map.of("scheduledNext7d", scheduledNext, "sentLast7d", sentLast);
    }

    
}
