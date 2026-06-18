// This class defines the DTO of outgoing user preference responses to frontend
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
public class UserPreferencesResponse {
    private Long id;
    private List<String> dietTags; // enum names such as VEGETARIAN, GLUTEN_FREE
    private List<String> allergyTags; // enum names, e.g. NUTS
    private int expiryAlertDays;
    private boolean dailySuggestionOn;
    private String textSize; // enum types such as SMALL, MEDIUM, LARGE
    private BigDecimal budgetPerServe;
}
