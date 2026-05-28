// This interface defines DB queries for 'IngredientAlias' table by writing method names
package com.dishcision.backend.repository;

import com.dishcision.backend.model.IngredientAlias;
import org.springframework.data.jpa.repository.JpaRepository; // automatically gives save(), findByID(), delete(), etc.
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface IngredientAliasRepository extends JpaRepository<IngredientAlias, Long> {
    // Define custom queries (Spring Data JPA reads the method names and
    // automatically generates the SQL queries)

    // For autocomplete (partial match for ingredient name on any alias)
    @Query("SELECT a FROM IngredientAlias a JOIN FETCH a.ingredient WHERE LOWER(a.alias) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<IngredientAlias> searchByAlias(@Param("q") String q);

    // For exact resolution - "chicken breast" --> Ingredient(id=1)
    Optional<IngredientAlias> findByAliasIgnoreCase(String alias);
}
