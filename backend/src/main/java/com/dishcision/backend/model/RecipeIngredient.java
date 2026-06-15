// This file represents the ingredients that a recipe requires
package com.dishcision.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "recipe_ingredients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeIngredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    @ToString.Exclude
    private Recipe recipe;

    @Column(name = "ingredient_name", nullable = false)
    private String ingredientName;

    // Nullable — set when the ingredient maps to a canonical entry
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "canonical_ingredient_id")
    @ToString.Exclude
    private Ingredient canonicalIngredient;

    @Column(precision = 10, scale = 2)
    private BigDecimal quantity;

    private String unit;

    // Field named "optional" to avoid Lombok's is-prefix stripping on "isOptional"
    @Column(name = "is_optional", nullable = false)
    @Builder.Default
    private boolean optional = false;

    private String notes;
}
