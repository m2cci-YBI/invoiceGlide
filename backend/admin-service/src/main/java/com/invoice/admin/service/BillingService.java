package com.invoice.admin.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.billingportal.Session;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class BillingService {
    private final String secretKey;

    public BillingService(@Value("${stripe.secret-key:}") String secretKey) {
        this.secretKey = secretKey;
    }

    private boolean configured() { return secretKey != null && !secretKey.isBlank(); }

    public String createCheckoutUrl(String stripePriceId, String successUrl, String cancelUrl, Map<String, String> metadata) throws StripeException {
        if (!configured()) {
            throw new IllegalStateException("Stripe not configured");
        }
        Stripe.apiKey = secretKey;
        com.stripe.param.checkout.SessionCreateParams params = com.stripe.param.checkout.SessionCreateParams.builder()
                .setMode(com.stripe.param.checkout.SessionCreateParams.Mode.SUBSCRIPTION)
                .setSuccessUrl(successUrl)
                .setCancelUrl(cancelUrl)
                .addLineItem(com.stripe.param.checkout.SessionCreateParams.LineItem.builder().setQuantity(1L)
                        .setPrice(stripePriceId).build())
                .putAllMetadata(metadata)
                .build();
        com.stripe.model.checkout.Session session = com.stripe.model.checkout.Session.create(params);
        return session.getUrl();
    }

    public String createPortalUrl(String customerId, String returnUrl) throws StripeException {
        if (!configured()) {
            throw new IllegalStateException("Stripe not configured");
        }
        Stripe.apiKey = secretKey;
        com.stripe.param.billingportal.SessionCreateParams params = com.stripe.param.billingportal.SessionCreateParams.builder()
                .setCustomer(customerId)
                .setReturnUrl(returnUrl)
                .build();
        Session session = Session.create(params);
        return session.getUrl();
    }
}
