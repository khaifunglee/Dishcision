// This file creates a User model to map users to the DB
package com.dishcision.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data // Uses Lombok dependency to generate getters, setters, and toString
@Entity // Uses JPA to map Java objects to DB tables
@Table(name = "users") // DB table name

public class User {
    // ID
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto-increments ID
    private Long id;
    // User email
    @Column(unique = true, nullable = false)
    private String email;
    // User password (store hashed pws)
    @Column(nullable = false)
    private String password;
    // User name
    @Column(nullable = false)
    private String name;

    // Email verification — account can't log in until this is true.
    @Column(name = "email_verified", nullable = false, columnDefinition = "boolean default false")
    private boolean emailVerified = false;

    // Current active 6-digit verification code (null once verified)
    @Column(name = "verification_code")
    private String verificationCode;

    @Column(name = "verification_code_expires_at")
    private LocalDateTime verificationCodeExpiresAt;

    // Failed verification attempts against the current code — locks out after 5
    @Column(name = "verification_attempts", nullable = false, columnDefinition = "integer default 0")
    private int verificationAttempts = 0;
}
