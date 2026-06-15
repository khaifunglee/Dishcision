// This class defines the DTO of ingredients belonging to a recipe
package com.dishcision.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeIngredientDTO {
    private Long id;
    private String ingredientName;
    private Long canonicalIngredientId;
    private BigDecimal quantity;
    private String unit;
    private boolean optional;
    private String notes;
    // Populated on detail view — true if the user's pantry has this ingredient
    private boolean inPantry;
}
