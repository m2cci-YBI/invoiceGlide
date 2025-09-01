package com.invoice.admin.web;

import com.invoice.admin.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthService authService;
    @org.springframework.beans.factory.annotation.Value("${APP_BASE_URL:}")
    private String appBaseUrl;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    public record RegisterRequest(@Email String email, @NotBlank String password, @NotBlank String name) {}
    public record LoginRequest(@Email String email, @NotBlank String password) {}
    public record TokenResponse(String accessToken, String refreshToken, String tokenType, long expiresIn) {}
    public record RefreshRequest(@NotBlank String refreshToken) {}
    public record ForgotPasswordRequest(@Email String email) {}
    public record ResetPasswordRequest(@NotBlank String token, @NotBlank String password) {}
    public record ResendConfirmationRequest(@Email String email) {}

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody RegisterRequest req, HttpServletRequest httpReq) {
        authService.register(req.email(), req.password(), req.name(), getBaseUrl(httpReq));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/confirm-email")
    public ResponseEntity<TokenResponse> confirmEmail(@RequestParam("token") String token) {
        var pair = authService.confirmEmail(token);
        return ResponseEntity.ok(new TokenResponse(pair.accessToken(), pair.refreshToken(), "Bearer", pair.expiresIn()));
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest req) {
        var pair = authService.login(req.email(), req.password());
        return ResponseEntity.ok(new TokenResponse(pair.accessToken(), pair.refreshToken(), "Bearer", pair.expiresIn()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(@RequestBody RefreshRequest req) {
        var pair = authService.refresh(req.refreshToken());
        return ResponseEntity.ok(new TokenResponse(pair.accessToken(), pair.refreshToken(), "Bearer", pair.expiresIn()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        var uid = SecurityUtils.currentUserId();
        authService.logout(uid);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@RequestBody ForgotPasswordRequest req, HttpServletRequest httpReq) {
        authService.forgotPassword(req.email(), getBaseUrl(httpReq));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@RequestBody ResetPasswordRequest req) {
        authService.resetPassword(req.token(), req.password());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/resend-confirmation")
    public ResponseEntity<Void> resendConfirmation(@RequestBody ResendConfirmationRequest req, HttpServletRequest httpReq) {
        authService.resendEmailConfirmation(req.email(), getBaseUrl(httpReq));
        return ResponseEntity.ok().build();
    }

    private String getBaseUrl(HttpServletRequest req) {
        if (appBaseUrl != null && !appBaseUrl.isBlank()) return appBaseUrl;
        String scheme = req.getHeader("X-Forwarded-Proto");
        String host = req.getHeader("X-Forwarded-Host");
        if (scheme != null && host != null) return scheme + "://" + host;
        String scheme0 = req.getScheme();
        String serverName = req.getServerName();
        int serverPort = req.getServerPort();
        StringBuilder url = new StringBuilder();
        url.append(scheme0).append("://").append(serverName);
        if (serverPort != 80 && serverPort != 443) url.append(":").append(serverPort);
        return url.toString();
    }
}
