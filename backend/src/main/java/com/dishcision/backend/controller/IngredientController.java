// This file handles incoming HTTP ingredient search requests from frontend
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

    // GET (200) search request
    // @RequestParam reads a query string parameter
    // e.g /api/ingredients/search?q=tomato
    @GetMapping("/search")
    public ResponseEntity<List<IngredientSearchResult>> search(@RequestParam String q) {
        if (q == null || q.trim().length() < 2) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        return ResponseEntity.ok(ingredientService.search(q.trim()));
    }
}
