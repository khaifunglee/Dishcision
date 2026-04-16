// This class defines the shape (DTO) of incoming login requests.
package com.dishcision.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.*;;

@Data
// Logins only require email + password
public class LoginRequest {
    @Email
    @NotBlank
    private String email;
    @NotBlank
    private String password;
}
