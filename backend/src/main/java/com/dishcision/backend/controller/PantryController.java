// This file handles HTTP pantry item requests from frontend
package com.dishcision.backend.controller;

import com.dishcision.backend.dto.PantryItemRequest;
import com.dishcision.backend.dto.PantryItemResponse;
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
@RequestMapping("pantry")
@RequiredArgsConstructor
public class PantryController {

    private final PantryService pantryService;

    // GET (200) pantry request
    @GetMapping("/getList")
    public ResponseEntity<List<PantryItemResponse>> getPantry() {
        return ResponseEntity.ok(pantryService.getPantryForUser(getCurrentUserId()));
    }

    // POST (201) new pantry item request (@RequestBody deserializes JSON body)
    @PostMapping("/addItem")
    public ResponseEntity<PantryItemResponse> addItem(@RequestBody PantryItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(pantryService.addItem(getCurrentUserId(), request));
    }

    // PUT (201) updated pantry item request
    // @PathVariable extracts from the URL path /api/pantry/update/{id}
    @PutMapping("/update/{id}")
    public ResponseEntity<PantryItemResponse> updateItem(
            @PathVariable Long id,
            @RequestBody PantryItemRequest request) {
        return ResponseEntity.ok(pantryService.updateItem(getCurrentUserId(), id, request));
    }

    // DEL (204) pantry item request
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        pantryService.deleteItem(getCurrentUserId(), id);
        return ResponseEntity.noContent().build();
    }

    // Extracts the authenticated user's ID from the JWT-backed SecurityContext.
    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl principal = (UserDetailsImpl) auth.getPrincipal();
        return principal.getId();
    }
}