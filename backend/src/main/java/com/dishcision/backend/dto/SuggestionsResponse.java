// This class defines the DTO of outgoing recipe suggestion responses to the frontend
package com.dishcision.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SuggestionsResponse {
    private int pantryItemCount;
    private int totalRecipes;
    // 0 missing required ingredients
    private List<RecipeSummaryDTO> fullMatch;
    // 1–2 missing required ingredients
    private List<RecipeSummaryDTO> nearMatch;
}
