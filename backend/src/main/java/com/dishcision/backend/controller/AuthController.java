// This file handles incoming HTTP register/login requests from frontend
package com.dishcision.backend.controller;

import com.dishcision.backend.dto.*;
import com.dishcision.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController // every method returns JSON
@RequestMapping("/auth")
@RequiredArgsConstructor

public class AuthController {

    private final AuthService authService;

    // POST Register request
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        String token = authService.register(request);
        return ResponseEntity.ok(Map.of("token", token));
    }

    // POST Login request
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        String token = authService.login(request);
        return ResponseEntity.ok(Map.of("token", token));
    }
}
