package com.invoice.mailing.api;

import com.invoice.mailing.db.ReminderRuleEntity;
import com.invoice.mailing.db.ReminderRuleRepository;
import com.invoice.mailing.web.AuthContext;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(path = "/api/mail/v1/schedules", produces = MediaType.APPLICATION_JSON_VALUE)
public class RemindersController {
    public record ReminderRule(String name, int daysAfterDue, boolean enabled) {}

    private final ReminderRuleRepository repo;
    private final com.invoice.mailing.service.RemindersState state;

    public RemindersController(ReminderRuleRepository repo, com.invoice.mailing.service.RemindersState state) {
        this.repo = repo; this.state = state;
        // Do not access AuthContext at startup (no authenticated principal). Rules are loaded per request.
    }

    @GetMapping("/reminders")
    public List<ReminderRule> list(@RequestParam(value = "clientId", required = false) UUID clientId) {
        UUID orgId = AuthContext.userId();
        if (clientId != null) {
            List<ReminderRuleEntity> clientRules = repo.findByOrgIdAndClientIdOrderByDaysAfterDueAsc(orgId, clientId);
            if (clientRules != null && !clientRules.isEmpty()) return toDtoList(clientRules);
        }
        List<ReminderRuleEntity> orgRules = repo.findByOrgIdAndClientIdIsNullOrderByDaysAfterDueAsc(orgId);
        if (orgRules != null && !orgRules.isEmpty()) return toDtoList(orgRules);
        return toDtoList(repo.findByOrgIdIsNullAndClientIdIsNullOrderByDaysAfterDueAsc());
    }

    @PutMapping("/reminders")
    public List<ReminderRule> save(@RequestBody List<ReminderRule> body,
                                   @RequestParam(value = "clientId", required = false) UUID clientId) {
        UUID orgId = AuthContext.userId();
        // Delete existing rules strictly within the intended scope, then insert new ones
        List<ReminderRuleEntity> existing;
        if (clientId != null) {
            existing = repo.findByOrgIdAndClientIdOrderByDaysAfterDueAsc(orgId, clientId);
        } else {
            existing = repo.findByOrgIdAndClientIdIsNullOrderByDaysAfterDueAsc(orgId);
        }
        if (existing != null && !existing.isEmpty()) {
            repo.deleteAll(existing);
        }
        List<ReminderRuleEntity> toSave = new ArrayList<>();
        OffsetDateTime now = OffsetDateTime.now();
        for (ReminderRule r : body) {
            ReminderRuleEntity e = new ReminderRuleEntity();
            e.setOrgId(orgId); // Set orgId
            e.setClientId(clientId); e.setName(r.name()); e.setDaysAfterDue(r.daysAfterDue()); e.setEnabled(r.enabled());
            e.setCreatedAt(now); e.setUpdatedAt(now);
            toSave.add(e);
        }
        repo.saveAll(toSave);
        // Return only the rules from the exact scope the user edited
        List<ReminderRule> out;
        if (clientId != null) {
            out = toDtoList(repo.findByOrgIdAndClientIdOrderByDaysAfterDueAsc(orgId, clientId));
        } else {
            out = toDtoList(repo.findByOrgIdAndClientIdIsNullOrderByDaysAfterDueAsc(orgId));
            // Optionally update in-memory state with org-level rules
            state.setRules(out);
        }
        return out;
    }

    private List<ReminderRule> toDtoList(List<ReminderRuleEntity> entities) {
        List<ReminderRule> out = new ArrayList<>();
        if (entities != null) {
            for (ReminderRuleEntity e : entities) {
                out.add(new ReminderRule(e.getName(), e.getDaysAfterDue(), e.isEnabled()));
            }
        }
        return out;
    }
}
