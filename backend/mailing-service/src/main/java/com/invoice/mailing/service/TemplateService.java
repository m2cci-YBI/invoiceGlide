package com.invoice.mailing.service;

import com.invoice.mailing.api.dto.TemplateDto;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class TemplateService {
    private static class Def {
        final String id;
        final String name;
        final String subject;
        final String resource;

        Def(String id, String name, String subject, String resource) {
            this.id = id;
            this.name = name;
            this.subject = subject;
            this.resource = resource;
        }
    }

    private final List<Def> defs = List.of(
            new Def("TPL-INVOICE", "Invoice", "Invoice {invoice.number} from {company.name}", "mail-templates/TPL-INVOICE.html"),
            new Def("TPL-REMINDER", "Reminder", "Reminder: Invoice {invoice.number} is due", "mail-templates/TPL-REMINDER.html"),
            new Def("TPL-RECEIPT", "Receipt", "Receipt for invoice {invoice.number}", "mail-templates/TPL-RECEIPT.html"),
            new Def("TPL-CONFIRMATION", "Email confirmation", "Confirm your email address", "mail-templates/TPL-CONFIRMATION.html"),
            new Def("TPL-PASSWORD-RESET", "Password reset", "Reset your password", "mail-templates/TPL-PASSWORD-RESET.html")
    );

    public List<TemplateDto> list() {
        List<TemplateDto> out = new ArrayList<>();
        for (Def d : defs) {
            out.add(new TemplateDto(d.id, d.name, d.subject, null));
        }
        return out;
    }

    public TemplateDto get(String id) {
        Def d = defs.stream().filter(x -> x.id.equals(id)).findFirst().orElse(null);
        if (d == null) return null;
        return new TemplateDto(d.id, d.name, d.subject, readResource(d.resource));
    }

    public String render(String templateId, Map<String, Object> model) {
        Def d = defs.stream().filter(x -> x.id.equals(templateId)).findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Template not found"));
        String body = readResource(d.resource);
        return simpleRender(body, model);
    }

    public String renderSubject(String templateId, Map<String, Object> model) {
        Def d = defs.stream().filter(x -> x.id.equals(templateId)).findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Template not found"));
        return simpleRender(d.subject, model);
    }

    private String readResource(String path) {
        try {
            var res = new ClassPathResource(path);
            byte[] bytes = res.getInputStream().readAllBytes();
            return new String(bytes, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to read template resource: " + path, e);
        }
    }

    private String simpleRender(String input, Map<String, Object> model) {
        String out = input;
        if (model != null) {
            for (Map.Entry<String, Object> e : model.entrySet()) {
                out = out.replace("{" + e.getKey() + "}", String.valueOf(e.getValue()));
            }
        }
        return out;
    }
}
