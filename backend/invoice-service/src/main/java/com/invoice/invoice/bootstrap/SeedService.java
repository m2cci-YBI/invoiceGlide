package com.invoice.invoice.bootstrap;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.invoice.invoice.entity.ClientEntity;
import com.invoice.invoice.entity.InvoiceEntity;
import com.invoice.invoice.entity.InvoiceLineEntity;
import com.invoice.invoice.repo.ClientRepository;
import com.invoice.invoice.repo.InvoiceLineRepository;
import com.invoice.invoice.repo.InvoiceRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import javax.crypto.SecretKey;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
public class SeedService {
    private final ClientRepository clients;
    private final InvoiceRepository invoices;
    private final InvoiceLineRepository lines;

    @Value("${admin.base-url}") private String adminBaseUrl;
    @Value("${admin.seed.email:}") private String seedEmail;
    @Value("${admin.seed.password:}") private String seedPassword;
    @Value("${security.jwt.secret}") private String jwtSecret;

    public SeedService(ClientRepository clients, InvoiceRepository invoices, InvoiceLineRepository lines) {
        this.clients = clients; this.invoices = invoices; this.lines = lines;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void seed() {
        try {
            if (seedEmail == null || seedEmail.isBlank() || seedPassword == null || seedPassword.isBlank()) return;
            UUID userId = resolveUserId(seedEmail, seedPassword);
            if (userId == null) return;
            if (!clients.findByUserIdOrderByNameAsc(userId).isEmpty()) return; // already seeded
            // Seed clients
            var c1 = mkClient(userId, "Acme Corp", "billing@acme.com", "555-123-4567", "USD", "North America");
            var c2 = mkClient(userId, "Globex Inc.", "accounts@globex.com", "555-987-6543", "CAD", "North America");
            var c3 = mkClient(userId, "Soylent Corp", "finance@soylent.com", "555-555-1212", "EUR", "Europe");
            var c4 = mkClient(userId, "Initech", "ap@initech.com", "555-333-2222", "USD", "North America"); c4.setArchived(true);
            var c5 = mkClient(userId, "Umbrella Corp", "payments@umbrella.com", "555-777-8888", "GBP", "Europe");
            clients.saveAll(List.of(c1,c2,c3,c4,c5));
            // Seed invoices (approximate from UI sample)
            addInvoice(userId, c1, "INV-2025-001", LocalDate.of(2025,8,5), LocalDate.of(2025,8,19), "USD", bd(1200), bd(156), bd(0), "COLLECTED");
            addInvoice(userId, c2, "INV-2025-002", LocalDate.of(2025,8,10), LocalDate.of(2025,9,10), "CAD", bd(800), bd(104), bd(0), "OPEN");
            addInvoice(userId, c3, "INV-2025-003", LocalDate.of(2025,8,15), LocalDate.of(2025,8,29), "EUR", bd(300), bd(39), bd(0), "COLLECTED");
            addInvoice(userId, c1, "INV-2025-016", LocalDate.of(2025,8,1), LocalDate.of(2025,8,10), "USD", bd(500), bd(65), bd(0), "OVERDUE");
            addInvoice(userId, c5, "INV-2025-004", LocalDate.of(2025,7,1), LocalDate.of(2025,7,15), "GBP", bd(2500), bd(325), bd(0), "COLLECTED");
            addInvoice(userId, c1, "INV-2025-005", LocalDate.of(2025,7,10), LocalDate.of(2025,9,15), "USD", bd(1500), bd(195), bd(0), "OPEN");
            addInvoice(userId, c2, "INV-2025-006", LocalDate.of(2025,7,20), LocalDate.of(2025,8,3), "CAD", bd(700), bd(91), bd(0), "COLLECTED");
            addInvoice(userId, c2, "INV-2025-017", LocalDate.of(2025,7,5), LocalDate.of(2025,7,15), "CAD", bd(1000), bd(130), bd(0), "OVERDUE");
            addInvoice(userId, c3, "INV-2025-007", LocalDate.of(2025,6,1), LocalDate.of(2025,6,15), "EUR", bd(400), bd(52), bd(0), "COLLECTED");
            addInvoice(userId, c5, "INV-2025-008", LocalDate.of(2025,6,10), LocalDate.of(2025,9,20), "GBP", bd(3000), bd(390), bd(0), "OPEN");
            addInvoice(userId, c1, "INV-2025-009", LocalDate.of(2025,6,20), LocalDate.of(2025,7,4), "USD", bd(1000), bd(130), bd(0), "COLLECTED");
            addInvoice(userId, c2, "INV-2025-010", LocalDate.of(2025,5,5), LocalDate.of(2025,5,19), "CAD", bd(900), bd(117), bd(0), "COLLECTED");
            addInvoice(userId, c3, "INV-2025-011", LocalDate.of(2025,5,15), LocalDate.of(2025,9,25), "EUR", bd(600), bd(78), bd(0), "OPEN");
            addInvoice(userId, c2, "INV-2025-019", LocalDate.of(2025,5,1), LocalDate.of(2025,5,10), "CAD", bd(200), bd(26), bd(0), "OVERDUE");
            addInvoice(userId, c5, "INV-2025-012", LocalDate.of(2025,4,1), LocalDate.of(2025,4,15), "GBP", bd(2000), bd(260), bd(0), "COLLECTED");
            addInvoice(userId, c1, "INV-2025-013", LocalDate.of(2025,4,10), LocalDate.of(2025,4,24), "USD", bd(1100), bd(143), bd(0), "COLLECTED");
            addInvoice(userId, c1, "INV-2025-020", LocalDate.of(2025,4,5), LocalDate.of(2025,4,15), "USD", bd(1500), bd(195), bd(0), "OVERDUE");
            addInvoice(userId, c2, "INV-2025-014", LocalDate.of(2025,3,5), LocalDate.of(2025,3,19), "CAD", bd(1300), bd(169), bd(0), "COLLECTED");
            addInvoice(userId, c3, "INV-2025-015", LocalDate.of(2025,3,15), LocalDate.of(2025,3,29), "EUR", bd(500), bd(65), bd(0), "COLLECTED");
            addInvoice(userId, c2, "INV-2025-021", LocalDate.of(2025,3,10), LocalDate.of(2025,3,20), "CAD", bd(800), bd(104), bd(0), "OVERDUE");
        } catch (Exception ignored) { }
    }

    private UUID resolveUserId(String email, String password) {
        try {
            RestTemplate rt = new RestTemplate();
            HttpHeaders headers = new HttpHeaders(); headers.setContentType(MediaType.APPLICATION_JSON);
            var req = new HttpEntity<>(Map.of("email", email, "password", password), headers);
            var resp = rt.postForEntity(adminBaseUrl + "/api/v1/auth/login", req, Map.class);
            String access = (String)((Map<?,?>)resp.getBody()).get("accessToken");
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
            Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(access).getBody();
            return UUID.fromString(claims.getSubject());
        } catch (Exception e) { return null; }
    }

    private ClientEntity mkClient(UUID uid, String name, String email, String phone, String currency, String region){
        ClientEntity c = new ClientEntity(); c.setUserId(uid); c.setName(name); c.setEmail(email); c.setPhone(phone); c.setCurrency(currency); c.setRegion(region); return c;
    }
    private static BigDecimal bd(double v){ return new BigDecimal(String.valueOf(v)); }
    private void addInvoice(UUID uid, ClientEntity c, String number, LocalDate issue, LocalDate due, String currency,
                            BigDecimal amount, BigDecimal tax, BigDecimal discount, String status){
        InvoiceEntity inv = new InvoiceEntity();
        inv.setUserId(uid); inv.setNumber(number); inv.setClientId(c.getId()); inv.setClientName(c.getName());
        inv.setIssueDate(issue); inv.setDueDate(due); inv.setCurrency(currency); inv.setSubtotal(amount);
        inv.setTaxTotal(tax); inv.setDiscountTotal(discount); inv.setTotal(amount.add(tax).subtract(discount));
        // Seed a default 13% tax breakdown matching sample data
        try {
            inv.setTaxesJson("[{\"name\":\"HST\",\"ratePct\":13}]");
            inv.setDiscountsJson("[]");
        } catch (Exception ignored) {}
        inv.setStatus(status);
        InvoiceEntity saved = invoices.save(inv);
        InvoiceLineEntity line = new InvoiceLineEntity(); line.setInvoiceId(saved.getId()); line.setDescription("Service");
        line.setQty(new BigDecimal("1")); line.setUnit("unit"); line.setUnitPrice(amount); line.setLineTotal(amount);
        lines.save(line);
    }
}
