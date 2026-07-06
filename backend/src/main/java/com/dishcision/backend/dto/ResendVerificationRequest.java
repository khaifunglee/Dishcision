// This class defines the shape (DTO) of incoming resend-verification-code requests.
package com.dishcision.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class ResendVerificationRequest {
    @Email
    @NotBlank
    private String email;
}
