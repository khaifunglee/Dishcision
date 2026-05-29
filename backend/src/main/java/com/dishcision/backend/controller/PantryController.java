package com.dishcision.backend.controller;

import com.dishcision.backend.dto.PantryItemRequest;
import com.dishcision.backend.dto.PantryItemResponse;
import com.dishcision.backend.security.JwtFilter;
import com.dishcision.backend.security.UserDetailsImpl;
import com.dishcision.backend.service.PantryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pantry")
@RequiredArgsConstructor
public class PantryController {

    private final PantryService pantryService;

    // GET pantry request
    @GetMapping
    public ResponseEntity<List<PantryItemResponse>> getPantry() {
        return ResponseEntity.ok(pantryService.getPantryForUser(getCurrentUserId()));
    }

    // POST new pantry item request
    @PostMapping
    public ResponseEntity<PantryItemResponse> addItem(@RequestBody PantryItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(pantryService.addItem(getCurrentUserId(), request));
    }

    // Update pantry item request
    @PutMapping("/{id}")
    public ResponseEntity<PantryItemResponse> updateItem(
            @PathVariable Long id,
            @RequestBody PantryItemRequest request) {
        return ResponseEntity.ok(pantryService.updateItem(getCurrentUserId(), id, request));
    }

    // Remove pantry item request
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        pantryService.deleteItem(getCurrentUserId(), id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Extracts the authenticated user's ID from the JWT-backed SecurityContext.
     * Adjust the cast to match your UserDetailsImpl class name.
     */
    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl principal = (UserDetailsImpl) auth.getPrincipal();
        return principal.getId();
    }
}