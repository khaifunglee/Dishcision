// This interface defines DB queries for cooking_history table
package com.dishcision.backend.repository;

import com.dishcision.backend.model.CookingHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface CookingHistoryRepository extends JpaRepository<CookingHistory, Long> {

       List<CookingHistory> findByUserIdOrderByCookedAtDesc(Long userId);

       // Calculates total $ saved from all cooked recipes since param 'since'
       @Query("SELECT COALESCE(SUM(h.costSaved), 0) FROM CookingHistory h " +
                     "WHERE h.userId = :userId AND h.cookedAt >= :since")
       BigDecimal sumCostSavedSince(@Param("userId") Long userId, @Param("since") LocalDateTime since);

       @Query("SELECT COUNT(h) FROM CookingHistory h " +
                     "WHERE h.userId = :userId AND h.cookedAt >= :since")
       long countMealsSince(@Param("userId") Long userId, @Param("since") LocalDateTime since);

       // Returns [recipeId, count] pairs ordered by most cooked first
       @Query("SELECT h.recipeId, COUNT(h) FROM CookingHistory h " +
                     "WHERE h.userId = :userId AND h.cookedAt >= :since " +
                     "GROUP BY h.recipeId ORDER BY COUNT(h) DESC")
       List<Object[]> findTopRecipesSince(@Param("userId") Long userId, @Param("since") LocalDateTime since);
}
