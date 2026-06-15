// This interface defines DB queries for recipes table by writing method names
package com.dishcision.backend.repository;

import com.dishcision.backend.model.DietaryTag;
import com.dishcision.backend.model.Recipe;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {

    // Filter query for recipes with optional cuisine / cook-time / dietary filters
    // DISTINCT is required because LEFT JOIN on dietaryTags can fan out rows.
    @Query("SELECT DISTINCT r FROM Recipe r " +
            "WHERE (:cuisine IS NULL OR LOWER(r.cuisine) = LOWER(:cuisine)) " +
            "AND (:maxCookTime IS NULL OR r.cookTimeMins <= :maxCookTime) " +
            "AND (:dietaryTag IS NULL OR :dietaryTag MEMBER OF r.dietaryTags)")
    Page<Recipe> findWithFilters(
            @Param("cuisine") String cuisine,
            @Param("maxCookTime") Integer maxCookTime,
            @Param("dietaryTag") DietaryTag dietaryTag,
            Pageable pageable);

    // Fetches all recipes with their ingredients in one query
    @Query("SELECT DISTINCT r FROM Recipe r LEFT JOIN FETCH r.ingredients")
    List<Recipe> findAllWithIngredients();

    // Fetches a single recipe with ingredients for the recipe detail page
    @Query("SELECT r FROM Recipe r LEFT JOIN FETCH r.ingredients WHERE r.id = :id")
    Optional<Recipe> findByIdWithIngredients(@Param("id") Long id);
}
