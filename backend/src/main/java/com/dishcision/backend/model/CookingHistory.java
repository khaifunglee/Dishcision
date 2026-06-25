// This file creates a cooking history model to record recipes cooked & $ saved per week
package com.dishcision.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cooking_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CookingHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "recipe_id", nullable = false)
    private Long recipeId;

    @Column(name = "servings_cooked", nullable = false)
    private int servingsCooked;

    // costSaved = (AVG_MEAL_OUT (~$18) - recipe.costPerServe) * servings
    // Recorded at cookedAt time
    @Column(name = "cost_saved", precision = 10, scale = 2)
    private BigDecimal costSaved;

    @Column(name = "cooked_at", nullable = false)
    private LocalDateTime cookedAt;

    @PrePersist
    protected void onCreate() {
        cookedAt = LocalDateTime.now();
    }
}
