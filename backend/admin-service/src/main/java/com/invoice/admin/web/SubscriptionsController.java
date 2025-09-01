package com.invoice.admin.web;

import com.invoice.admin.domain.SubscriptionStatus;
import com.invoice.admin.entity.PlanEntity;
import com.invoice.admin.entity.SubscriptionEntity;
import com.invoice.admin.repo.PlanRepository;
import com.invoice.admin.repo.UserRepository;
import com.invoice.admin.service.BillingService;
import com.invoice.admin.service.SubscriptionService;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class SubscriptionsController {
    private final SubscriptionService subscriptionService;
    private final PlanRepository plans;
    private final BillingService billingService;
    private final UserRepository users;
    private final String appBaseUrl;

    public SubscriptionsController(SubscriptionService subscriptionService, PlanRepository plans, BillingService billingService,
                                   UserRepository users, @Value("${APP_BASE_URL:http://localhost:8080}") String appBaseUrl) {
        this.subscriptionService = subscriptionService;
        this.plans = plans;
        this.billingService = billingService;
        this.users = users;
        this.appBaseUrl = appBaseUrl;
    }

    public record SubscribeRequest(@NotBlank String planCode) {}

    @GetMapping("/subscriptions/me")
    public ResponseEntity<?> getMySubscription() {
        var uid = SecurityUtils.currentUserId();
        var maybe = subscriptionService.currentForUser(uid);
        if (maybe.isEmpty()) return ResponseEntity.ok(Map.of());
        var s = maybe.get();
        Integer daysLeft = null;
        if (s.getStatus() == SubscriptionStatus.TRIALING && s.getTrialEndAt() != null) {
            long days = Duration.between(Instant.now(), s.getTrialEndAt()).toDays();
            daysLeft = (int) Math.max(days, 0);
        }
        var plan = plans.findById(s.getPlanId()).orElse(null);
        java.util.HashMap<String, Object> resp = new java.util.HashMap<>();
        resp.put("id", s.getId());
        resp.put("userId", s.getUserId());
        if (plan != null) resp.put("planCode", plan.getCode());
        resp.put("status", s.getStatus());
        resp.put("startAt", s.getStartAt());
        resp.put("trialEndAt", s.getTrialEndAt());
        resp.put("currentPeriodEnd", s.getCurrentPeriodEnd());
        resp.put("daysLeft", daysLeft);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/subscriptions")
    public ResponseEntity<?> subscribe(@RequestBody SubscribeRequest req) {
        var uid = SecurityUtils.currentUserId();
        PlanEntity plan = plans.findByCode(req.planCode()).orElseThrow();
        if (plan.getPriceCents() == null || plan.getPriceCents() == 0) {
            // free/trial plan
            var s = subscriptionService.startTrial(uid, plan.getCode());
            return ResponseEntity.ok(Map.of("id", s.getId(), "status", s.getStatus(), "planCode", plan.getCode()));
        }
        if (plan.getStripePriceId() == null || plan.getStripePriceId().isBlank()) {
            throw new IllegalArgumentException("Plan missing stripePriceId");
        }
        var user = users.findById(uid).orElseThrow();
        String successUrl = appBaseUrl + "/settings/subscription?status=success";
        String cancelUrl = appBaseUrl + "/settings/subscription?status=cancel";
        try {
            String url = billingService.createCheckoutUrl(plan.getStripePriceId(), successUrl, cancelUrl, Map.of("userId", uid.toString()));
            return ResponseEntity.ok(Map.of("checkoutUrl", url));
        } catch (Exception ex) {
            throw new IllegalArgumentException("Stripe not configured: " + ex.getMessage());
        }
    }


    @PostMapping("/billing/portal-session")
    public ResponseEntity<?> portal() {
        var uid = SecurityUtils.currentUserId();
        var user = users.findById(uid).orElseThrow();
        try {
            String url = billingService.createPortalUrl(user.getStripeCustomerId(), appBaseUrl + "/settings/subscription");
            return ResponseEntity.ok(Map.of("url", url));
        } catch (Exception ex) {
            throw new IllegalArgumentException("Stripe not configured: " + ex.getMessage());
        }
    }

}
