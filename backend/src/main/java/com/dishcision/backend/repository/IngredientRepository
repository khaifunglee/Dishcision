// This interface defines DB queries for 'Ingredient' table by writing method names
package com.dishcision.backend.repository;

import com.dishcision.backend.model.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository; // automatically gives save(), findByID(), delete(), etc.
import java.util.List;
import java.util.Optional;

public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
    // Define custom queries (Spring Data JPA reads the method names and
    // automatically generates the SQL queries)

    // For autocomplete (partial match for ingredient name on canonical name)
    // e.g cherry tomato --> tomato
    List<Ingredient> findByCanonicalNameContainingIgnoreCase(String name);

    // For exact resolution when saving ingredient name
    Optional<Ingredient> findByCanonicalNameIgnoreCase(String name);
}
