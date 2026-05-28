// This file creates a pantry item model to map ingredients in a user's pantry
package com.dishcision.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "pantry_items")
@Data // Uses Lombok dependency to generate getters, setters, and toString
@NoArgsConstructor // Generates a constructor for PantryItem with no parameters
@AllArgsConstructor // Generates a constructor requiring argument for every field
@Builder // Produces complex builder APIs for PantryItem

public class PantryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Foreign key to link to User entity
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    private User user;

    @Column(name = "ingredient_name", nullable = false)
    private String ingredientName;

    // Nullable - only set Ingredient if alias resolves to a canonical ingredient
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "canonical_ingredient_id")
    @ToString.Exclude
    private Ingredient canonicalIngredient;

    @Column(precision = 10, scale = 2)
    private BigDecimal quantity;

    private String unit;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    private String category;

    // created_at & updated_at are used to calc expiry date
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // @prepersist invokes onCreate() method when an instance is created
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    // @preupdate invokes onUpdate() method when an instance is updated
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
