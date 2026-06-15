// This class defines the DTO of summarized recipe details and data required for matching
package com.dishcision.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

// Used by GET /recipes (list) and GET /recipes/suggestions.
// Includes match data so the frontend can sort by pantry match without a second call.
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeSummaryDTO {
    private Long id;
    private String name;
    private String cuisine;
    private Integer cookTimeMins;
    private Integer servings;
    private BigDecimal costPerServe;
    private Integer calories;
    private String imageUrl;
    private List<String> dietaryTags;
    // Match data (# of matched ingredients, # of missing, etc.)
    private int matchedCount;
    private int totalRequired;
    private List<MissingIngredientDTO> missingIngredients;
}
