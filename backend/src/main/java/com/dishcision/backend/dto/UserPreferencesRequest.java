// This class defines the DTO of incoming user preference request from frontend
// Used to update user preferences
package com.dishcision.backend.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

// All fields nullable, only non-null fields are applied during a PUT request (partial update) - idempotent
@Data
public class UserPreferencesRequest {
    private List<String> dietTags; // null = don't change; empty list = clear all tags
    private List<String> allergyTags; // null = don't change; empty list = clear all tags
    private Integer expiryAlertDays;
    private Boolean dailySuggestionOn;
    private String textSize; // "SMALL" | "MEDIUM" | "LARGE"
    private BigDecimal budgetPerServe;
}
