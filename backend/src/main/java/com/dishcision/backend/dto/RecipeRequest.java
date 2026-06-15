// This class defines the DTO of incoming recipe requests from the API
package com.dishcision.backend.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class RecipeRequest {
    private String name;
    private String cuisine;
    private Integer cookTimeMins;
    private Integer servings;
    private BigDecimal costPerServe;
    private Integer calories;
    private String imageUrl;
    private List<String> dietaryTags;
    private List<RecipeIngredientRequest> ingredients;
    private List<String> steps;
}
