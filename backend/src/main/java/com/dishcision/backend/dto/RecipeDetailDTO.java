// This class defines the DTO of recipe details for recipe detail page
package com.dishcision.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

// Used by GET /recipes/{id}. Extends the summary with steps and per-ingredient inPantry flags.
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeDetailDTO {
    private Long id;
    private String name;
    private String cuisine;
    private Integer cookTimeMins;
    private Integer servings;
    private BigDecimal costPerServe;
    private Integer calories;
    private String imageUrl;
    private String source;
    private List<String> dietaryTags;
    private List<RecipeIngredientDTO> ingredients;
    private List<String> steps;
    // Match data (same as summary — included so detail screen can show the match
    // pill)
    private int matchedCount;
    private int totalRequired;
    private List<MissingIngredientDTO> missingIngredients;
}
