// This class defines the shape (DTO) of incoming register requests.
package com.dishcision.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
// Register requests require name, email, password (fill in user DB)
public class RegisterRequest {
    @NotBlank
    private String name;
    @Email
    @NotBlank
    private String email;
    @Size(min = 8)
    @NotBlank
    private String password;
}
