// This class defines the DTO of cooked recipes 
package com.dishcision.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CookingHistoryDTO {
    private Long id;
    private Long recipeId;
    private String recipeName;
    private int servingsCooked;
    private BigDecimal costSaved;
    private LocalDateTime cookedAt;
}
