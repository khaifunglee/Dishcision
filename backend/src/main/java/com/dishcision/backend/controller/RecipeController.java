// This file handles HTTP recipe requests from frontend
package com.dishcision.backend.controller;

import com.dishcision.backend.dto.*;
import com.dishcision.backend.security.UserDetailsImpl;
import com.dishcision.backend.service.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/recipes")
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeService recipeService;

    // GET (200) recipe request (with optional filters)
    // e.g:
    // /recipes?cuisine=Italian&maxCookTime=30&dietaryTag=VEGETARIAN&page=0&size=50
    @GetMapping
    public ResponseEntity<Page<RecipeSummaryDTO>> getRecipes(
            @RequestParam(required = false) String cuisine,
            @RequestParam(required = false) Integer maxCookTime,
            @RequestParam(required = false) String dietaryTag,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {

        return ResponseEntity.ok(recipeService.getRecipes(
                getCurrentUserId(), cuisine, maxCookTime, dietaryTag,
                PageRequest.of(page, size)));
    }

    // GET (200) suggestions request
    @GetMapping("/suggestions")
    public ResponseEntity<SuggestionsResponse> getSuggestions() {
        return ResponseEntity.ok(recipeService.getSuggestions(getCurrentUserId()));
    }

    // GET (200) recipe details
    @GetMapping("/{id}")
    public ResponseEntity<RecipeDetailDTO> getRecipeDetail(@PathVariable Long id) {
        return ResponseEntity.ok(recipeService.getRecipeDetail(getCurrentUserId(), id));
    }

    // POST (201) new recipe request
    @PostMapping
    public ResponseEntity<RecipeDetailDTO> createRecipe(@RequestBody RecipeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(recipeService.createRecipe(getCurrentUserId(), request));
    }

    // Extract authenticated user's ID from JWT-backed SecurityContext.
    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl principal = (UserDetailsImpl) auth.getPrincipal();
        return principal.getId();
    }
}
