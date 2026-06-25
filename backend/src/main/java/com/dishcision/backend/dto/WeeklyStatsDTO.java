// This file defines the DTO of weekly stats for the user dashboard
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
public class WeeklyStatsDTO {
    // All retrieved from CookedHistory repository
    private long mealsCooked;
    private BigDecimal totalSaved;
    private String mostCookedRecipe;
}
