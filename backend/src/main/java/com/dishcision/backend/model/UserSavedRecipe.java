// This file creates a saved recipes model for users to favourite
package com.dishcision.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_saved_recipes", uniqueConstraints = @UniqueConstraint(columnNames = { "user_id", "recipe_id" }))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSavedRecipe {

    // User and recipe ID required to identify saved recipe
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "recipe_id", nullable = false)
    private Long recipeId;

    @Column(name = "saved_at", nullable = false)
    private LocalDateTime savedAt;

    @PrePersist
    protected void onCreate() {
        savedAt = LocalDateTime.now();
    }
}
