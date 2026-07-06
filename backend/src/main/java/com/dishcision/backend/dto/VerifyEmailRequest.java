// This class defines the shape (DTO) of incoming email verification requests.
package com.dishcision.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class VerifyEmailRequest {
    @Email
    @NotBlank
    private String email;
    @NotBlank
    private String code;
}
