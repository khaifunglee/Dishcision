// This DTO response defines the shape for error responses to send to frontend (error code + message)
package com.dishcision.backend.dto;

public record ErrorResponse(String error, String message) {

}
