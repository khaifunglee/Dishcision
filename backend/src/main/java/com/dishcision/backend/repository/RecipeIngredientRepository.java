// This interface defines DB queries for recipe_ingredients table
package com.dishcision.backend.repository;

import com.dishcision.backend.model.RecipeIngredient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecipeIngredientRepository extends JpaRepository<RecipeIngredient, Long> {
    // Find recipe ingredients based on the recipe ID it belongs to
    List<RecipeIngredient> findByRecipeId(Long recipeId);
}
