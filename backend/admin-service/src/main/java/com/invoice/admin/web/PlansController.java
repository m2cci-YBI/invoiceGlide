package com.invoice.admin.web;

import com.invoice.admin.entity.PlanEntity;
import com.invoice.admin.service.PlanService;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/plans")
public class PlansController {
    private final PlanService planService;

    public PlansController(PlanService planService) {
        this.planService = planService;
    }

    public record CreatePlanRequest(@NotBlank String code, @NotBlank String name,
                                    Integer priceCents, String currency, String interval,
                                    Integer trialDays, Boolean active, String featuresJson, String stripePriceId) {}

    @GetMapping
    public ResponseEntity<List<PlanEntity>> list() {
        return ResponseEntity.ok(planService.listActive());
    }

    @PostMapping
    public ResponseEntity<PlanEntity> create(@RequestBody CreatePlanRequest req) {
        var p = new PlanEntity();
        p.setCode(req.code());
        p.setName(req.name());
        p.setPriceCents(req.priceCents());
        p.setCurrency(req.currency());
        if (req.interval() != null) p.setInterval(com.invoice.admin.domain.Interval.valueOf(req.interval()));
        p.setTrialDays(req.trialDays());
        p.setActive(req.active() == null ? Boolean.TRUE : req.active());
        p.setFeaturesJson(req.featuresJson());
        p.setStripePriceId(req.stripePriceId());
        var saved = planService.save(p);
        return ResponseEntity.created(URI.create("/api/v1/plans/" + saved.getId())).body(saved);
    }
}

