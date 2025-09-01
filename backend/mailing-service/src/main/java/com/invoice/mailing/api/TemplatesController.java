package com.invoice.mailing.api;

import com.invoice.mailing.api.dto.RenderRequest;
import com.invoice.mailing.api.dto.TemplateDto;
import com.invoice.mailing.service.TemplateService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = "/api/mail/v1/templates", produces = MediaType.APPLICATION_JSON_VALUE)
public class TemplatesController {
    private final TemplateService templates;

    public TemplatesController(TemplateService templates) { this.templates = templates; }

    @GetMapping
    public List<TemplateDto> list() { return templates.list(); }

    @GetMapping("/{id}")
    public TemplateDto get(@PathVariable String id) { return templates.get(id); }

    @PutMapping("/{id}")
    public TemplateDto put(@PathVariable String id, @RequestBody TemplateDto body) {
        throw new ResponseStatusException(HttpStatus.METHOD_NOT_ALLOWED, "Templates are fixed and cannot be edited");
    }

    @PostMapping("/render")
    public Map<String,String> render(@Valid @RequestBody RenderRequest req) {
        String html = templates.render(req.getTemplateId(), req.getModel());
        return Map.of("html", html);
    }

    @PostMapping("/render-subject")
    public Map<String,String> renderSubject(@Valid @RequestBody RenderRequest req) {
        String subject = templates.renderSubject(req.getTemplateId(), req.getModel());
        return Map.of("subject", subject);
    }
}
