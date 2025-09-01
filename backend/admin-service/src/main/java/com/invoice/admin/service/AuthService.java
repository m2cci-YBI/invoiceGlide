package com.invoice.admin.service;

import com.invoice.admin.domain.Role;
import com.invoice.admin.entity.RefreshTokenEntity;
import com.invoice.admin.entity.UserEntity;
import com.invoice.admin.repo.RefreshTokenRepository;
import com.invoice.admin.repo.UserRepository;
import com.invoice.admin.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {
    private final UserRepository users;
    private final RefreshTokenRepository refreshTokens;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;
    private final long refreshTtlSeconds;
    private final long emailConfirmationTtlSeconds;
    private final long passwordResetTtlSeconds;
    private final MailingClient mailingClient;

    public AuthService(UserRepository users, RefreshTokenRepository refreshTokens,
                       PasswordEncoder encoder, JwtService jwtService,
                       @Value("${security.jwt.refresh-ttl-seconds:${security.jwt.refresh-ttl:1209600}}") long refreshTtlSeconds,
                       @Value("${security.jwt.email-confirmation-ttl-seconds:86400}") long emailConfirmationTtlSeconds,
                       @Value("${security.jwt.password-reset-ttl-seconds:3600}") long passwordResetTtlSeconds,
                       MailingClient mailingClient) {
        this.users = users;
        this.refreshTokens = refreshTokens;
        this.encoder = encoder;
        this.jwtService = jwtService;
        this.refreshTtlSeconds = refreshTtlSeconds;
        this.emailConfirmationTtlSeconds = emailConfirmationTtlSeconds;
        this.passwordResetTtlSeconds = passwordResetTtlSeconds;
        this.mailingClient = mailingClient;
    }

    public record TokenPair(String accessToken, String refreshToken, long expiresIn) {}

    public void register(String email, String password, String name, String baseUrl) {
        users.findByEmail(email).ifPresent(u -> { throw new IllegalArgumentException("Email already in use"); });
        UserEntity u = new UserEntity();
        u.setEmail(email);
        u.setPasswordHash(encoder.encode(password));
        u.setName(name);
        u.setRole(Role.USER);
        u.setEmailConfirmationToken(UUID.randomUUID().toString());
        u.setEmailConfirmationTokenExpires(Instant.now().plusSeconds(emailConfirmationTtlSeconds));
        u = users.save(u);
        try {
            String confirmationUrl = baseUrl + "/confirm-email?token=" + u.getEmailConfirmationToken();
            mailingClient.sendEmailConfirmation(u.getEmail(), u.getName(), confirmationUrl);
        } catch (Exception ignored) {}
    }

    public TokenPair login(String email, String password) {
        UserEntity u = users.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        if (!encoder.matches(password, u.getPasswordHash())) throw new IllegalArgumentException("Invalid credentials");
        if (!u.isEmailConfirmed()) throw new IllegalArgumentException("Email not confirmed");
        return issueTokens(u);
    }

    public void logout(UUID userId) {
        refreshTokens.deleteByUserId(userId);
    }

    public TokenPair refresh(String refreshToken) {
        RefreshTokenEntity rt = refreshTokens.findByToken(refreshToken)
                .filter(r -> r.getRevokedAt() == null && r.getExpiresAt().isAfter(Instant.now()))
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));
        UserEntity u = users.findById(rt.getUserId()).orElseThrow();
        // rotate: revoke old
        rt.setRevokedAt(Instant.now());
        refreshTokens.save(rt);
        return issueTokens(u);
    }

    public TokenPair confirmEmail(String token) {
        UserEntity u = users.findByEmailConfirmationToken(token)
                .filter(user -> user.getEmailConfirmationTokenExpires().isAfter(Instant.now()))
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired confirmation token"));
        u.setEmailConfirmed(true);
        u.setEmailConfirmationToken(null);
        u.setEmailConfirmationTokenExpires(null);
        users.save(u);
        try { mailingClient.seedDefaultRemindersForUser(u.getId(), u.getEmail(), u.getRole().name()); } catch (Exception ignored) {}
        return issueTokens(u);
    }

    public void forgotPassword(String email, String baseUrl) {
        UserEntity u = users.findByEmail(email).orElse(null);
        if (u == null) return; // Don't reveal if user exists
        u.setPasswordResetToken(UUID.randomUUID().toString());
        u.setPasswordResetTokenExpires(Instant.now().plusSeconds(passwordResetTtlSeconds));
        users.save(u);
        try {
            String resetUrl = baseUrl + "/reset-password?token=" + u.getPasswordResetToken();
            mailingClient.sendPasswordReset(u.getEmail(), u.getName(), resetUrl);
        } catch (Exception ignored) {}
    }

    public void resendEmailConfirmation(String email, String baseUrl) {
        UserEntity u = users.findByEmail(email).orElse(null);
        if (u == null) return; // Do not reveal user existence
        if (u.isEmailConfirmed()) return; // Nothing to do
        u.setEmailConfirmationToken(UUID.randomUUID().toString());
        u.setEmailConfirmationTokenExpires(Instant.now().plusSeconds(emailConfirmationTtlSeconds));
        users.save(u);
        try {
            String confirmationUrl = baseUrl + "/confirm-email?token=" + u.getEmailConfirmationToken();
            mailingClient.sendEmailConfirmation(u.getEmail(), u.getName(), confirmationUrl);
        } catch (Exception ignored) {}
    }

    public void resetPassword(String token, String password) {
        UserEntity u = users.findByPasswordResetToken(token)
                .filter(user -> user.getPasswordResetTokenExpires().isAfter(Instant.now()))
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired password reset token"));
        u.setPasswordHash(encoder.encode(password));
        u.setPasswordResetToken(null);
        u.setPasswordResetTokenExpires(null);
        users.save(u);
    }

    private TokenPair issueTokens(UserEntity u) {
        String access = jwtService.generateAccessToken(u.getId().toString(), u.getEmail(), u.getRole().name(), Map.of());
        RefreshTokenEntity rt = new RefreshTokenEntity();
        rt.setUserId(u.getId());
        rt.setToken(UUID.randomUUID().toString());
        rt.setExpiresAt(Instant.now().plusSeconds(refreshTtlSeconds));
        refreshTokens.save(rt);
        return new TokenPair(access, rt.getToken(), refreshTtlSeconds);
    }
}
