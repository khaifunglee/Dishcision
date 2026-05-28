// This class defines the shape (DTO) of incoming pantry item requests from the API
package com.dishcision.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PantryItemRequest {
    private String ingredientName;
    private BigDecimal quantity;
    private String unit;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate expiryDate;
    private String category;
}
