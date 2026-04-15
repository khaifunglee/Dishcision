// This file creates a User model to map users to the DB
package com.dishcision.backend.model;

import jakarta.persistence.*;
import lombok.Data;

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
}
