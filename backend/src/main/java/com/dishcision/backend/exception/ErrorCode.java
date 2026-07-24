// This file represents an enum for the error code statuses that the app can throw
package com.dishcision.backend.exception;

import org.springframework.http.HttpStatus;

public enum ErrorCode {
    EMAIL_IN_USE(HttpStatus.CONFLICT), // 409
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED), // 401
    EMAIL_NOT_VERIFIED(HttpStatus.FORBIDDEN), // 403
    EMAIL_ALREADY_VERIFIED(HttpStatus.CONFLICT), // 409
    TOO_MANY_ATTEMPTS(HttpStatus.TOO_MANY_REQUESTS), // 429
    INVALID_CODE(HttpStatus.BAD_REQUEST), // 400
    INCORRECT_PASSWORD(HttpStatus.BAD_REQUEST); // 400

    private final HttpStatus status;

    ErrorCode(HttpStatus status) {
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
