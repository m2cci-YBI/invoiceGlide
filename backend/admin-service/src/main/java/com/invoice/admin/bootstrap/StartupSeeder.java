package com.invoice.admin.bootstrap;

import com.invoice.admin.domain.Role;
import com.invoice.admin.domain.SubscriptionStatus;
import com.invoice.admin.entity.PlanEntity;
import com.invoice.admin.entity.SubscriptionEntity;
import com.invoice.admin.entity.UserEntity;
import com.invoice.admin.repo.PlanRepository;
import com.invoice.admin.repo.SubscriptionRepository;
import com.invoice.admin.repo.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;

@Component
public class StartupSeeder {

    private final UserRepository users;
    private final PlanRepository plans;
    private final SubscriptionRepository subs;
    private final PasswordEncoder encoder;

    @Value("${SEED_USER_EMAIL:}")
    private String seedEmail;
    @Value("${SEED_USER_PASSWORD:}")
    private String seedPassword;
    @Value("${SEED_USER_NAME:}")
    private String seedName;
    @Value("${SEED_PLAN_CODE:FREE_TRIAL_7D}")
    private String seedPlanCode;

    private final com.invoice.admin.service.MailingClient mailingClient;

    public StartupSeeder(UserRepository users, PlanRepository plans, SubscriptionRepository subs, PasswordEncoder encoder,
                         com.invoice.admin.service.MailingClient mailingClient) {
        this.users = users;
        this.plans = plans;
        this.subs = subs;
        this.encoder = encoder;
        this.mailingClient = mailingClient;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void seed() {
        if (seedEmail == null || seedEmail.isBlank() || seedPassword == null || seedPassword.isBlank()) return;
        UserEntity u = users.findByEmail(seedEmail).orElseGet(() -> {
            UserEntity nu = new UserEntity();
            nu.setEmail(seedEmail);
            nu.setName(seedName == null || seedName.isBlank() ? seedEmail : seedName);
            nu.setRole(Role.USER);
            nu.setPasswordHash(encoder.encode(seedPassword));
            // Ensure the env-seeded user can log in immediately
            nu.setEmailConfirmed(true);
            nu.setEmailConfirmationToken(null);
            nu.setEmailConfirmationTokenExpires(null);
            return users.save(nu);
        });
        // Update password if changed
        if (!encoder.matches(seedPassword, u.getPasswordHash())) {
            u.setPasswordHash(encoder.encode(seedPassword));
            if (seedName != null && !seedName.isBlank()) u.setName(seedName);
            users.save(u);
        }
        // Ensure email is confirmed for the env-seeded user (covers already-existing user)
        if (!u.isEmailConfirmed()) {
            u.setEmailConfirmed(true);
            u.setEmailConfirmationToken(null);
            u.setEmailConfirmationTokenExpires(null);
            users.save(u);
        }
        // Ensure a subscription exists
        Optional<SubscriptionEntity> existing = subs.findFirstByUserIdOrderByStartAtDesc(u.getId());
        if (existing.isEmpty()) {
            PlanEntity plan = plans.findByCode(seedPlanCode).orElseGet(() -> plans.findByCode("FREE_TRIAL_7D").orElse(null));
            if (plan != null) {
                SubscriptionEntity s = new SubscriptionEntity();
                s.setUserId(u.getId());
                s.setPlanId(plan.getId());
                if (plan.getTrialDays() != null && plan.getTrialDays() > 0) {
                    s.setStatus(SubscriptionStatus.TRIALING);
                    s.setTrialEndAt(Instant.now().plus(Duration.ofDays(plan.getTrialDays())));
                } else {
                    s.setStatus(SubscriptionStatus.ACTIVE);
                }
                subs.save(s);
            }
        }
        try { mailingClient.seedDefaultRemindersForUser(u.getId(), u.getEmail(), u.getRole().name()); } catch (Exception ignored) {}
    }
}
