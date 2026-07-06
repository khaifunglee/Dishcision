// This file handles incoming HTTP register/login requests from frontend
package com.dishcision.backend.controller;

import com.dishcision.backend.dto.*;
import com.dishcision.backend.security.UserDetailsImpl;
import com.dishcision.backend.service.AuthService;
import com.dishcision.backend.service.EmailNotVerifiedException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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

    // POST (201) register — creates an unverified account and emails a code.
    // Returned AuthResponse has no token yet (client must verify before login).
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    // POST (201) login — returns token + user info. Returns 403 with a
    // structured error if the account's email hasn't been verified yet.
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            return ResponseEntity.ok(authService.login(request));
        } catch (EmailNotVerifiedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "EMAIL_NOT_VERIFIED", "message", e.getMessage()));
        }
    }

    // POST (200) verify-email — confirms the 6-digit code and returns a real token
    @PostMapping("/verify-email")
    public ResponseEntity<AuthResponse> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        return ResponseEntity.ok(authService.verifyEmail(request));
    }

    // POST (200) resend-verification — regenerates and re-sends the code
    @PostMapping("/resend-verification")
    public ResponseEntity<Void> resendVerification(@Valid @RequestBody ResendVerificationRequest request) {
        authService.resendVerification(request);
        return ResponseEntity.ok().build();
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
