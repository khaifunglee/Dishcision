// This class defines the DTO of incoming cooked recipe requests from API
package com.dishcision.backend.dto;

import lombok.Data;

@Data
public class CookRequest {
    private int servings; // only servings required to calc $ saved
}
