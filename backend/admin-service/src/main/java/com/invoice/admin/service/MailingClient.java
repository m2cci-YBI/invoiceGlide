package com.invoice.admin.service;

import com.invoice.admin.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class MailingClient {
    private final String baseUrl;
    private final JwtService jwtService;
    private final RestTemplate http = new RestTemplate();

    public MailingClient(@Value("${mailing.base-url:${MAILING_BASE_URL:http://mailing-service:8083/api/mail/v1}}") String baseUrl, JwtService jwtService) {
        String b = baseUrl;
        if (b != null && !b.contains("/api/mail")) {
            if (b.endsWith("/")) b = b.substring(0, b.length()-1);
            b = b + "/api/mail/v1";
        }
        this.baseUrl = (b != null && b.endsWith("/")) ? b.substring(0, b.length()-1) : b;
        this.jwtService = jwtService;
    }

    public void seedDefaultRemindersForUser(UUID userId, String email, String role) {
        try {
            String token = jwtService.generateAccessToken(userId.toString(), email, role, Map.of());
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(token);
            List<Map<String,Object>> body = List.of(
                    Map.of("name","Reminder before due (3 days)", "daysAfterDue", -3, "enabled", true),
                    Map.of("name","On due date", "daysAfterDue", 0, "enabled", true),
                    Map.of("name","After due (7 days)", "daysAfterDue", 7, "enabled", true),
                    Map.of("name","After due (21 days)", "daysAfterDue", 21, "enabled", true)
            );
            HttpEntity<List<Map<String,Object>>> req = new HttpEntity<>(body, headers);
            http.exchange(baseUrl + "/schedules/reminders", HttpMethod.PUT, req, String.class);
        } catch (Exception ignored) {
            // Do not fail user creation if mailing service is unavailable
        }
    }

    public void sendEmailConfirmation(String email, String name, String url) {
        Map<String, String> body = Map.of("email", email, "name", name, "url", url);
        HttpEntity<Map<String, String>> req = new HttpEntity<>(body);
        http.postForObject(baseUrl + "/email/confirmation", req, String.class);
    }

    public void sendPasswordReset(String email, String name, String url) {
        Map<String, String> body = Map.of("email", email, "name", name, "url", url);
        HttpEntity<Map<String, String>> req = new HttpEntity<>(body);
        http.postForObject(baseUrl + "/email/password-reset", req, String.class);
    }
}
