// This class defines the DTO of missing ingredients for a full recipe match
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
public class MissingIngredientDTO {
    private String ingredientName;
    private BigDecimal quantity;
    private String unit;
}
