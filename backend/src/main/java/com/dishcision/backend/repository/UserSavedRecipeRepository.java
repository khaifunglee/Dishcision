// This interface defines DB queries for saved_recipes table
package com.dishcision.backend.repository;

import com.dishcision.backend.model.UserSavedRecipe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserSavedRecipeRepository extends JpaRepository<UserSavedRecipe, Long> {
    boolean existsByUserIdAndRecipeId(Long userId, Long recipeId);

    Optional<UserSavedRecipe> findByUserIdAndRecipeId(Long userId, Long recipeId);

    List<UserSavedRecipe> findByUserId(Long userId);

    void deleteByUserIdAndRecipeId(Long userId, Long recipeId);

    void deleteByUserId(Long userId);
}
