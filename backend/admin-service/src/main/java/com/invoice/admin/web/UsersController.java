package com.invoice.admin.web;

import com.invoice.admin.repo.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
public class UsersController {
    private final UserRepository users;

    public UsersController(UserRepository users) {
        this.users = users;
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        var uid = SecurityUtils.currentUserId();
        var user = users.findById(uid).orElseThrow();
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "name", user.getName(),
                "role", user.getRole()
        ));
    }
}

