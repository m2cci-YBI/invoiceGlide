package com.invoice.invoice.web;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.UUID;

public class AuthContext {
    public static UUID userId() {
        Authentication a = SecurityContextHolder.getContext().getAuthentication();
        if (a != null && a.getPrincipal() instanceof Jwt jwt) {
            return UUID.fromString(jwt.getSubject());
        }
        throw new IllegalStateException("No authenticated user");
    }

    public static UUID userIdOrNull() {
        Authentication a = SecurityContextHolder.getContext().getAuthentication();
        if (a != null && a.getPrincipal() instanceof Jwt jwt) {
            try { return UUID.fromString(jwt.getSubject()); } catch (Exception ignored) {}
        }
        return null;
    }
}
