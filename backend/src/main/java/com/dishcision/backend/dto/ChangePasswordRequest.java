// This class defines the DTO of outgoing new password responses to frontend
package com.dishcision.backend.dto;

import lombok.Data;

@Data
public class ChangePasswordRequest {
    private String currentPassword;
    private String newPassword;
}
