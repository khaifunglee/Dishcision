// This file represents API exception messages that carries an error code enum to handle different errors
// Only carries error code to keep service layer HTTP-free
package com.dishcision.backend.exception;

import lombok.Getter;

@Getter
public class ApiException extends RuntimeException {
    private final ErrorCode code;

    public ApiException(ErrorCode code, String message) {
        super(message);
        this.code = code;
    }
}
