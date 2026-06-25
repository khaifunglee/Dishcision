// This file handles business logic for cooked recipe functions
// Finds matching pantry items, deducts by the correct qty, calcs $ saved
package com.dishcision.backend.service;

import com.dishcision.backend.dto.CookingHistoryDTO;
import com.dishcision.backend.dto.CookResponse;
import com.dishcision.backend.dto.WeeklyStatsDTO;
import com.dishcision.backend.model.CookingHistory;
import com.dishcision.backend.model.PantryItem;
import com.dishcision.backend.model.Recipe;
import com.dishcision.backend.model.RecipeIngredient;
import com.dishcision.backend.repository.CookingHistoryRepository;
import com.dishcision.backend.repository.PantryItemRepository;
import com.dishcision.backend.repository.RecipeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CookService {
    // Hard-coded average meal out cost to calculate $ saved easily
    private static final BigDecimal BASELINE_MEAL_COST = new BigDecimal("18.00");

    private final RecipeRepository recipeRepository;
    private final PantryItemRepository pantryItemRepository;
    private final CookingHistoryRepository cookingHistoryRepository;
    private final IngredientMatchingService matchingService;
    private final PantryService pantryService;

    // Cook recipe is one whole atomic transaction
    @Transactional
    public CookResponse cookRecipe(Long userId, Long recipeId, int servings) {
        Recipe recipe = recipeRepository.findByIdWithIngredients(recipeId)
                .orElseThrow(() -> new EntityNotFoundException("Recipe not found: " + recipeId));

        // Build pantry lookup maps (pantry items ordered by expiry ASC to deduct
        // soonest-expiring first)
        List<PantryItem> pantry = pantryItemRepository.findByUserIdOrderByExpiryDateAsc(userId);
        Map<Long, List<PantryItem>> pantryByCanonical = buildPantryByCanonical(pantry);
        Map<String, List<PantryItem>> pantryByLowerName = buildPantryByName(pantry);

        // Scale factor (to scale up ingredients servings)
        BigDecimal scale = recipeServingsScale(recipe.getServings(), servings);
        List<String> warnings = new ArrayList<>();

        for (RecipeIngredient ri : recipe.getIngredients()) {
            if (ri.isOptional())
                continue;

            BigDecimal scaledQty = ri.getQuantity() != null
                    ? ri.getQuantity().multiply(scale).setScale(2, RoundingMode.HALF_UP)
                    : null;
            // Find recipe ingredients in pantry to deduct qty or send warning
            IngredientMatchingService.MatchResult match = matchingService.match(ri, scaledQty, pantryByCanonical,
                    pantryByLowerName);

            switch (match.getStatus()) {
                case MATCHED -> {
                    PantryItem item = match.getMatchedItem();
                    BigDecimal deductQty = match.getDeductionQty();
                    if (deductQty != null && deductQty.compareTo(BigDecimal.ZERO) > 0) {
                        // Deduct pantry item's qty with deductedQty
                        System.err.println("Item qty: " + item.getQuantity() + ", Deducted qty: " + deductQty);
                        BigDecimal newQty = item.getQuantity()
                                .subtract(deductQty)
                                .setScale(2, RoundingMode.HALF_UP);
                        System.err.println("New qty: " + newQty);
                        // Automatically delete pantry item if deductedQty >= item.getQuantity()
                        if (newQty.compareTo(BigDecimal.ZERO) <= 0) {
                            pantryItemRepository.delete(item);
                            // Remove from in-memory map so subsequent iterations
                            // don't attempt to deduct from a deleted item
                            removeFromMaps(item, pantryByCanonical, pantryByLowerName);
                        } else {
                            // Otherwise, save updated qty in pantry item
                            item.setQuantity(newQty);
                            pantryItemRepository.save(item);
                        }
                    }
                }
                case ASSUMED_AVAILABLE ->
                    warnings.add(ri.getIngredientName() + " (unit mismatch — check your pantry)");
                case NO_MATCH ->
                    warnings.add(ri.getIngredientName());
            }
        }

        // Calculate cost saved: can be negative if recipe costs more than eating out
        BigDecimal costPerServe = recipe.getCostPerServe() != null
                ? recipe.getCostPerServe()
                : BigDecimal.ZERO;
        BigDecimal costSaved = BASELINE_MEAL_COST
                .subtract(costPerServe)
                .multiply(BigDecimal.valueOf(servings))
                .setScale(2, RoundingMode.HALF_UP);
        // Build & save cooked recipe in cooking_history to record stats
        cookingHistoryRepository.save(CookingHistory.builder()
                .userId(userId)
                .recipeId(recipeId)
                .servingsCooked(servings)
                .costSaved(costSaved)
                .build());
        // Snapshot - updated pantry with deducted qty items
        List<com.dishcision.backend.dto.PantryItemResponse> snapshot = pantryService.getPantryForUser(userId);

        return CookResponse.builder()
                .pantrySnapshot(snapshot)
                .costSaved(costSaved)
                .warnings(warnings)
                .build();
    }

    // -------------------------------------------------------------------------
    // History
    // -------------------------------------------------------------------------
    // Fetch list of cooked recipes - ordered by latest cooked
    @Transactional(readOnly = true)
    public List<CookingHistoryDTO> getHistory(Long userId) {
        // Maps Cooking History entities to DTO
        List<CookingHistory> entries = cookingHistoryRepository
                .findByUserIdOrderByCookedAtDesc(userId);

        Set<Long> recipeIds = entries.stream()
                .map(CookingHistory::getRecipeId)
                .collect(Collectors.toSet());

        Map<Long, String> recipeNames = recipeRepository.findAllById(recipeIds).stream()
                .collect(Collectors.toMap(Recipe::getId, Recipe::getName));

        return entries.stream()
                .map(h -> CookingHistoryDTO.builder()
                        .id(h.getId())
                        .recipeId(h.getRecipeId())
                        .recipeName(recipeNames.getOrDefault(h.getRecipeId(), "Unknown Recipe"))
                        .servingsCooked(h.getServingsCooked())
                        .costSaved(h.getCostSaved())
                        .cookedAt(h.getCookedAt())
                        .build())
                .collect(Collectors.toList());
    }

    // -------------------------------------------------------------------------
    // Weekly stats
    // -------------------------------------------------------------------------
    // Calculate and build weekly stats DTO
    @Transactional(readOnly = true)
    public WeeklyStatsDTO getWeeklyStats(Long userId) {
        LocalDateTime since = LocalDateTime.now().minusDays(7);

        long mealsCooked = cookingHistoryRepository.countMealsSince(userId, since);
        BigDecimal totalSaved = cookingHistoryRepository.sumCostSavedSince(userId, since);

        String mostCookedRecipe = null;
        List<Object[]> top = cookingHistoryRepository.findTopRecipesSince(userId, since);
        if (!top.isEmpty()) {
            Long topRecipeId = (Long) top.get(0)[0];
            mostCookedRecipe = recipeRepository.findById(topRecipeId)
                    .map(Recipe::getName)
                    .orElse(null);
        }

        return WeeklyStatsDTO.builder()
                .mealsCooked(mealsCooked)
                .totalSaved(totalSaved != null ? totalSaved : BigDecimal.ZERO)
                .mostCookedRecipe(mostCookedRecipe)
                .build();
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------
    // Calculate multiplier of recipe servings cooked
    private BigDecimal recipeServingsScale(Integer recipeServings, int requestedServings) {
        if (recipeServings == null || recipeServings == 0)
            return BigDecimal.ONE;
        return BigDecimal.valueOf(requestedServings)
                .divide(BigDecimal.valueOf(recipeServings), 4, RoundingMode.HALF_UP);
    }

    // Groups pantry items by canonical ingredient ID
    private Map<Long, List<PantryItem>> buildPantryByCanonical(List<PantryItem> pantry) {
        Map<Long, List<PantryItem>> map = new HashMap<>();
        for (PantryItem item : pantry) {
            if (item.getCanonicalIngredient() != null) {
                map.computeIfAbsent(item.getCanonicalIngredient().getId(),
                        k -> new ArrayList<>()).add(item);
            }
        }
        return map;
    }

    // Groups pantry items by ingredient name
    private Map<String, List<PantryItem>> buildPantryByName(List<PantryItem> pantry) {
        Map<String, List<PantryItem>> map = new HashMap<>();
        for (PantryItem item : pantry) {
            map.computeIfAbsent(item.getIngredientName().toLowerCase(),
                    k -> new ArrayList<>()).add(item);
        }
        return map;
    }

    // Removes a deleted pantry item from the in-memory maps so later iterations
    // in the same cook function loop don't try to deduct from it again
    private void removeFromMaps(PantryItem item,
            Map<Long, List<PantryItem>> byCanonical,
            Map<String, List<PantryItem>> byName) {
        if (item.getCanonicalIngredient() != null) {
            List<PantryItem> list = byCanonical.get(item.getCanonicalIngredient().getId());
            if (list != null)
                list.remove(item);
        }
        List<PantryItem> byN = byName.get(item.getIngredientName().toLowerCase());
        if (byN != null)
            byN.remove(item);
    }
}
