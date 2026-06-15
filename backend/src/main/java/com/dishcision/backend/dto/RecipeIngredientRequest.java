// This class defines the DTO of incoming recipe ingredient requests from the API
package com.dishcision.backend.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class RecipeIngredientRequest {
    private String ingredientName;
    private Long canonicalIngredientId;
    private BigDecimal quantity;
    private String unit;
    private boolean optional;
    private String notes;
}
