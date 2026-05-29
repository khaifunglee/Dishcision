// This file handles incoming HTTP register/login requests from frontend
package com.dishcision.backend.controller;

import com.dishcision.backend.dto.IngredientSearchResult;
import com.dishcision.backend.service.IngredientService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController // every method returns JSON
@RequestMapping("/api/ingredients")
@RequiredArgsConstructor

public class IngredientController {

    private final IngredientService ingredientService;

    // GET search request
    @GetMapping("/search")
    public ResponseEntity<List<IngredientSearchResult>> search(@RequestParam String q) {
        if (q == null || q.trim().length() < 2) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        return ResponseEntity.ok(ingredientService.search(q.trim()));
    }
}
