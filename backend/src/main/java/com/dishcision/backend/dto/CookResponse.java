// This class defines the DTO of outgoing cooked recipe responses to the frontend
package com.dishcision.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CookResponse {
    // Return an updated pantry list after deducting used ingredients
    private List<PantryItemResponse> pantrySnapshot;
    private BigDecimal costSaved; // $ saved from cooking recipe calc. in service layer
    // Ingredient names that could not be deducted (no match or cross-type)
    private List<String> warnings;
}
