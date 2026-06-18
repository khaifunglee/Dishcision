// This file handles incoming HTTP register/login requests from frontend
package com.dishcision.backend.controller;

import com.dishcision.backend.dto.*;
import com.dishcision.backend.security.UserDetailsImpl;
import com.dishcision.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // POST (201) register — returns token + user info for client to populate the
    // profile header
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    // POST (201) login — returns token + user info
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // PUT (201) change password — requires current password for verification
    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(@RequestBody ChangePasswordRequest request) {
        authService.changePassword(getCurrentUserId(), request);
        return ResponseEntity.ok().build();
    }

    // PUT (201) update display name — returns fresh AuthResponse so the client can
    // update stored user info
    @PutMapping("/name")
    public ResponseEntity<AuthResponse> updateName(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(authService.updateName(getCurrentUserId(), body.get("name")));
    }

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl principal = (UserDetailsImpl) auth.getPrincipal();
        return principal.getId();
    }
}
