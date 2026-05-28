// This file creates an ingredient alias model to map ingredient aliases to ingredient names
package com.dishcision.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ingredient_aliases")
@Data // Uses Lombok dependency to generate getters, setters, and toString
@NoArgsConstructor // Generates a constructor for IngredientAlias with no parameters
@AllArgsConstructor // Generates a constructor requiring argument for every field
@Builder // Produces complex builder APIs for IngredientAlias

public class IngredientAlias {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Foreign key to link to Ingredient table
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ingredient_id", nullable = false)
    @ToString.Exclude
    private Ingredient ingredient;

    @Column(nullable = false)
    private String alias;
}
