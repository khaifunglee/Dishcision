// This class defines the DTO of ingredient search results for matching to canonical ingredient names
package com.dishcision.backend.dto;

import com.dishcision.backend.model.UnitType;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor

public class IngredientSearchResult {
    private Long id;
    private String canonicalName;
    private String defaultUnit;
    private UnitType unitType;
    private String category;
}
