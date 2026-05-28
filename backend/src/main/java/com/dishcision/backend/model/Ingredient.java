// This file creates an ingredient model to map ingredients in pantry to the DB
package com.dishcision.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ingredients")
@Data // Uses Lombok dependency to generate getters, setters, and toString
@NoArgsConstructor // Generates a constructor for Ingredient with no parameters
@AllArgsConstructor // Generates a constructor requiring argument for every field
@Builder // Produces complex builder APIs for Ingredient

public class Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "canonical_name", nullable = false, unique = true)
    private String canonicalName;

    @Column(name = "default_unit")
    private String defaultUnit;

    @Enumerated(EnumType.STRING)
    @Column(name = "unit_type")
    private UnitType unitType;

    private String category;
    // Link to ingredient_aliases (e.g tomato can have aliases such as roma, cherry,
    // canned, etc.)
    @OneToMany(mappedBy = "ingredient", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude // Prevents circular Lombok toString
    @Builder.Default
    private List<IngredientAlias> aliases = new ArrayList<>();
}
