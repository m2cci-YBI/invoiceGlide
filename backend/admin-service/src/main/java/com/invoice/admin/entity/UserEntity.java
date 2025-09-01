package com.invoice.admin.entity;

import com.invoice.admin.domain.Role;
import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "users")
public class UserEntity {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    @Column(name = "stripe_customer_id")
    private String stripeCustomerId;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    @Column(name = "email_confirmation_token")
    private String emailConfirmationToken;

    @Column(name = "email_confirmation_token_expires")
    private Instant emailConfirmationTokenExpires;

    @Column(name = "email_confirmed")
    private Boolean emailConfirmed = false;

    @Column(name = "password_reset_token")
    private String passwordResetToken;

    @Column(name = "password_reset_token_expires")
    private Instant passwordResetTokenExpires;

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }

    // Getters and setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public String getStripeCustomerId() { return stripeCustomerId; }
    public void setStripeCustomerId(String stripeCustomerId) { this.stripeCustomerId = stripeCustomerId; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
    public String getEmailConfirmationToken() { return emailConfirmationToken; }
    public void setEmailConfirmationToken(String emailConfirmationToken) { this.emailConfirmationToken = emailConfirmationToken; }
    public Instant getEmailConfirmationTokenExpires() { return emailConfirmationTokenExpires; }
    public void setEmailConfirmationTokenExpires(Instant emailConfirmationTokenExpires) { this.emailConfirmationTokenExpires = emailConfirmationTokenExpires; }
    public boolean isEmailConfirmed() { return Boolean.TRUE.equals(emailConfirmed); }
    public void setEmailConfirmed(boolean emailConfirmed) { this.emailConfirmed = emailConfirmed; }
    public String getPasswordResetToken() { return passwordResetToken; }
    public void setPasswordResetToken(String passwordResetToken) { this.passwordResetToken = passwordResetToken; }
    public Instant getPasswordResetTokenExpires() { return passwordResetTokenExpires; }
    public void setPasswordResetTokenExpires(Instant passwordResetTokenExpires) { this.passwordResetTokenExpires = passwordResetTokenExpires; }
}
