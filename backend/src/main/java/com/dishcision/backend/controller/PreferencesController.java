// This file handles HTTP requests for user preferences
package com.dishcision.backend.controller;

import com.dishcision.backend.dto.UserPreferencesRequest;
import com.dishcision.backend.dto.UserPreferencesResponse;
import com.dishcision.backend.security.UserDetailsImpl;
import com.dishcision.backend.service.PreferencesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/preferences")
@RequiredArgsConstructor
public class PreferencesController {

    private final PreferencesService preferencesService;

    // GET (200) current user's preferences
    @GetMapping
    public ResponseEntity<UserPreferencesResponse> getPreferences() {
        return ResponseEntity.ok(preferencesService.getPreferences(getCurrentUserId()));
    }

    // PUT (200) partial update
    @PutMapping
    public ResponseEntity<UserPreferencesResponse> updatePreferences(
            @RequestBody UserPreferencesRequest request) {
        return ResponseEntity.ok(preferencesService.updatePreferences(getCurrentUserId(), request));
    }

    // Extract authenticated user's ID from JWT-backed SecurityContext
    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl principal = (UserDetailsImpl) auth.getPrincipal();
        return principal.getId();
    }
}
