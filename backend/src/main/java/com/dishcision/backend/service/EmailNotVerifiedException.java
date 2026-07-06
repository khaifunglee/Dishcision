// Thrown when a user attempts to log in before verifying their email address
package com.dishcision.backend.service;

public class EmailNotVerifiedException extends RuntimeException {
    public EmailNotVerifiedException(String message) {
        super(message);
    }
}
