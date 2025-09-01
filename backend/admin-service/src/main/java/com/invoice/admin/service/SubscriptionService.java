package com.invoice.admin.service;

import com.invoice.admin.domain.SubscriptionStatus;
import com.invoice.admin.entity.PlanEntity;
import com.invoice.admin.entity.SubscriptionEntity;
import com.invoice.admin.repo.PlanRepository;
import com.invoice.admin.repo.SubscriptionRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class SubscriptionService {
    private final SubscriptionRepository subs;
    private final PlanRepository plans;

    public SubscriptionService(SubscriptionRepository subs, PlanRepository plans) {
        this.subs = subs;
        this.plans = plans;
    }

    public Optional<SubscriptionEntity> currentForUser(UUID userId) {
        Optional<SubscriptionEntity> s = subs.findFirstByUserIdOrderByStartAtDesc(userId);
        s.ifPresent(this::autoExpireTrialIfNeeded);
        return s;
    }

    private void autoExpireTrialIfNeeded(SubscriptionEntity s) {
        if (s.getStatus() == SubscriptionStatus.TRIALING && s.getTrialEndAt() != null && Instant.now().isAfter(s.getTrialEndAt())) {
            s.setStatus(SubscriptionStatus.EXPIRED);
            subs.save(s);
        }
    }

    public SubscriptionEntity startTrial(UUID userId, String planCode) {
        PlanEntity plan = plans.findByCode(planCode).orElseThrow();
        SubscriptionEntity s = new SubscriptionEntity();
        s.setUserId(userId);
        s.setPlanId(plan.getId());
        s.setStatus(SubscriptionStatus.TRIALING);
        if (plan.getTrialDays() != null && plan.getTrialDays() > 0) {
            s.setTrialEndAt(Instant.now().plus(Duration.ofDays(plan.getTrialDays())));
        }
        return subs.save(s);
    }
}

