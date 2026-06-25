// This file handles HTTP recipe requests from frontend
package com.dishcision.backend.controller;

import com.dishcision.backend.dto.*;
import com.dishcision.backend.security.UserDetailsImpl;
import com.dishcision.backend.service.CookService;
import com.dishcision.backend.service.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recipes")
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeService recipeService;
    private final CookService cookService;

    // GET (200) recipe list with optional filters
    @GetMapping
    public ResponseEntity<List<RecipeSummaryDTO>> getRecipes(
            @RequestParam(required = false) String cuisine,
            @RequestParam(required = false) Integer maxCookTime,
            @RequestParam(required = false) String dietaryTag) {
        return ResponseEntity.ok(recipeService.getRecipes(getCurrentUserId(), cuisine, maxCookTime, dietaryTag));
    }

    // GET (200) recipe suggestions filtered by user diet_tags
    @GetMapping("/suggestions")
    public ResponseEntity<SuggestionsResponse> getSuggestions() {
        return ResponseEntity.ok(recipeService.getSuggestions(getCurrentUserId()));
    }

    // GET (200) all recipes saved by the current user
    @GetMapping("/saved")
    public ResponseEntity<List<RecipeSummaryDTO>> getSavedRecipes() {
        return ResponseEntity.ok(recipeService.getSavedRecipes(getCurrentUserId()));
    }

    // GET (200) recipe details
    @GetMapping("/{id}")
    public ResponseEntity<RecipeDetailDTO> getRecipeDetail(@PathVariable Long id) {
        return ResponseEntity.ok(recipeService.getRecipeDetail(getCurrentUserId(), id));
    }

    // POST (200) save a recipe — idempotent, returns 200 even if already saved
    @PostMapping("/{id}/save")
    public ResponseEntity<Void> saveRecipe(@PathVariable Long id) {
        recipeService.saveRecipe(getCurrentUserId(), id);
        return ResponseEntity.ok().build();
    }

    // DELETE (204) unsave a recipe
    @DeleteMapping("/{id}/save")
    public ResponseEntity<Void> unsaveRecipe(@PathVariable Long id) {
        recipeService.unsaveRecipe(getCurrentUserId(), id);
        return ResponseEntity.noContent().build();
    }

    // POST (201) cook a recipe — deducts pantry, records history, returns snapshot
    @PostMapping("/{id}/cook")
    public ResponseEntity<CookResponse> cookRecipe(
            @PathVariable Long id,
            @RequestBody CookRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(cookService.cookRecipe(getCurrentUserId(), id, request.getServings()));
    }

    // POST (201) new recipe
    @PostMapping
    public ResponseEntity<RecipeDetailDTO> createRecipe(@RequestBody RecipeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(recipeService.createRecipe(getCurrentUserId(), request));
    }

    // Extract authenticated user's ID from JWT-backed SecurityContext
    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl principal = (UserDetailsImpl) auth.getPrincipal();
        return principal.getId();
    }
}
