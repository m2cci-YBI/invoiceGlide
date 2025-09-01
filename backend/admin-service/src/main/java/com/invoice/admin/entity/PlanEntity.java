package com.invoice.admin.entity;

import com.invoice.admin.domain.Interval;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "plans")
public class PlanEntity {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String name;

    @Column(name = "price_cents")
    private Integer priceCents;

    private String currency;

    @Enumerated(EnumType.STRING)
    private Interval interval;

    @Column(name = "trial_days")
    private Integer trialDays;

    private Boolean active = true;

    @Column(name = "features_json", columnDefinition = "text")
    private String featuresJson;

    @Column(name = "stripe_price_id")
    private String stripePriceId;

    // Getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Integer getPriceCents() { return priceCents; }
    public void setPriceCents(Integer priceCents) { this.priceCents = priceCents; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public Interval getInterval() { return interval; }
    public void setInterval(Interval interval) { this.interval = interval; }
    public Integer getTrialDays() { return trialDays; }
    public void setTrialDays(Integer trialDays) { this.trialDays = trialDays; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public String getFeaturesJson() { return featuresJson; }
    public void setFeaturesJson(String featuresJson) { this.featuresJson = featuresJson; }
    public String getStripePriceId() { return stripePriceId; }
    public void setStripePriceId(String stripePriceId) { this.stripePriceId = stripePriceId; }
}
