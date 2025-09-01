package com.invoice.invoice.web;

import com.invoice.invoice.entity.ClientEntity;
import com.invoice.invoice.repo.ClientRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/invoice/v1/clients")
public class ClientsController {
    private final ClientRepository clients;

    public ClientsController(ClientRepository clients) { this.clients = clients; }

    @GetMapping
    public ResponseEntity<List<ClientEntity>> list(@RequestParam(name = "archived", required = false) Boolean archived) {
        UUID uid = AuthContext.userId();
        if (archived == null) return ResponseEntity.ok(clients.findByUserIdOrderByNameAsc(uid));
        return ResponseEntity.ok(clients.findByUserIdAndArchivedOrderByNameAsc(uid, archived));
    }

    @PostMapping
    public ResponseEntity<ClientEntity> create(@RequestBody @Valid ClientEntity req) {
        UUID uid = AuthContext.userId();
        req.setId(null);
        req.setUserId(uid);
        ClientEntity saved = clients.save(req);
        return ResponseEntity.created(URI.create("/api/invoice/v1/clients/" + saved.getId())).body(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientEntity> get(@PathVariable("id") UUID id) {
        UUID uid = AuthContext.userId();
        ClientEntity c = clients.findById(id).orElseThrow();
        if (!c.getUserId().equals(uid)) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(c);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClientEntity> update(@PathVariable("id") UUID id, @RequestBody ClientEntity req) {
        UUID uid = AuthContext.userId();
        ClientEntity existing = clients.findById(id).orElseThrow();
        if (!existing.getUserId().equals(uid)) return ResponseEntity.notFound().build();
        existing.setName(req.getName());
        existing.setEmail(req.getEmail());
        existing.setPhone(req.getPhone());
        existing.setCurrency(req.getCurrency());
        existing.setRegion(req.getRegion());
        existing.setAddress(req.getAddress());
        existing.setArchived(req.isArchived());
        ClientEntity saved = clients.save(existing);
        return ResponseEntity.ok(saved);
    }
}
