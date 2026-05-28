// This class defines the shape (DTO) of outgoing pantry item responses to the frontend
package com.dishcision.backend.dto;

import com.dishcision.backend.model.UnitType;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class PantryItemResponse {
    private Long id;
    private String ingredientName;
    private BigDecimal quantity;
    private String unit;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate expiryDate;
    private String category;
    private Long canonicalIngredientId;
    private UnitType unitType;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;
}
