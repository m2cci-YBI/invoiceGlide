package com.invoice.admin.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Component
public class JwtService {

    private final SecretKey secretKey;
    private final long accessTtlSeconds;

    public JwtService(
            @Value("${security.jwt.secret}") String secret,
            @Value("${security.jwt.access-ttl-seconds:3600}") long accessTtlSeconds
    ) {
        byte[] keyBytes = secret == null ? new byte[0] : secret.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        try {
            if (keyBytes.length < 32) {
                // Derive a 256-bit key from the provided secret to satisfy HS256 requirements
                MessageDigest sha256 = MessageDigest.getInstance("SHA-256");
                keyBytes = sha256.digest(keyBytes);
            }
        } catch (Exception ignored) {}
        System.out.println("[JwtService] Initializing. keyBytes=" + keyBytes.length + ", accessTtlSeconds=" + accessTtlSeconds);
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
        this.accessTtlSeconds = accessTtlSeconds > 0 ? accessTtlSeconds : 3600L;
    }

    public String generateAccessToken(String userId, String email, String role, Map<String, Object> extraClaims) {
        Instant now = Instant.now();
        Instant exp = now.plusSeconds(accessTtlSeconds);
        return Jwts.builder()
                .setSubject(userId)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(exp))
                .addClaims(extraClaims == null ? Map.of() : extraClaims)
                .claim("email", email)
                .claim("role", role)
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }
}
