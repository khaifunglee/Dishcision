// This file handles the matching algorithm between recipe ingredients and a user's pantry
package com.dishcision.backend.service;

import com.dishcision.backend.model.PantryItem;
import com.dishcision.backend.model.RecipeIngredient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * Matching priority:
 * 1. Canonical ID — ri has a canonical ingredient name whose ID exists in
 * pantryByCanonical
 * 2. Alias — resolve ri.ingredientName to a canonical via IngredientService,
 * then look up that canonical in pantryByCanonical
 * 3. Name fallback — case-insensitive exact match on ingredientName string
 * against pantryByLowerName
 *
 * Returns a MatchResult describing whether the ingredient is available,
 * which pantry item to deduct from, and how much to deduct.
 */
@Service
@RequiredArgsConstructor
public class IngredientMatchingService {

    private final IngredientService ingredientService;
    private final UnitConversionService unitConversionService;

    // -------------------------------------------------------------------------
    // MatchResult object
    // -------------------------------------------------------------------------
    public enum MatchStatus {
        // Ingredient found and quantity sufficient — deductionQty is valid
        MATCHED,
        // Ingredient found but quantity insufficient — deductionQty = all available
        // (consumes the item)
        PARTIAL_MATCH,
        /**
         * Ingredient found but units are incomparable (e.g cross-type with no known
         * conversion). Treated as present for suggestions; no deduction on ingredients
         * upon cook.
         */
        ASSUMED_AVAILABLE,
        // No pantry item found for this ingredient
        NO_MATCH
    }

    public static class MatchResult {
        private final MatchStatus status;
        private final PantryItem matchedItem; // non-null only if MATCHED
        private final BigDecimal deductionQty; // = matchedItem.unit; non-null if MATCHED

        private MatchResult(MatchStatus status, PantryItem item, BigDecimal deductionQty) {
            this.status = status;
            this.matchedItem = item;
            this.deductionQty = deductionQty;
        }

        // Getter functions
        public MatchStatus getStatus() {
            return status;
        }

        public PantryItem getMatchedItem() {
            return matchedItem;
        }

        public BigDecimal getDeductionQty() {
            return deductionQty;
        }

        // Constructors
        static MatchResult matched(PantryItem item, BigDecimal deductQty) {
            return new MatchResult(MatchStatus.MATCHED, item, deductQty);
        }

        static MatchResult partialMatch(PantryItem item, BigDecimal deductQty) {
            return new MatchResult(MatchStatus.PARTIAL_MATCH, item, deductQty);
        }

        static MatchResult assumedAvailable() {
            return new MatchResult(MatchStatus.ASSUMED_AVAILABLE, null, null);
        }

        static MatchResult noMatch() {
            return new MatchResult(MatchStatus.NO_MATCH, null, null);
        }
    }

    // -------------------------------------------------------------------------
    // Public API
    // -------------------------------------------------------------------------

    /**
     * Match a recipe ingredient against the user's pantry
     *
     * @param ri                the recipe ingredient (with optional canonical link)
     * @param scaledQty         quantity needed after scaling for requested servings
     * @param pantryByCanonical pantry items grouped by canonical ingredient ID
     * @param pantryByLowerName pantry items grouped by lower-cased ingredientName
     */
    public MatchResult match(RecipeIngredient ri,
            BigDecimal scaledQty,
            Map<Long, List<PantryItem>> pantryByCanonical,
            Map<String, List<PantryItem>> pantryByLowerName) {

        List<PantryItem> candidates = findCandidates(ri, pantryByCanonical, pantryByLowerName);
        // Return no match if no candidate ingredients found
        if (candidates == null || candidates.isEmpty()) {
            return MatchResult.noMatch();
        }

        String recipeUnit = ri.getUnit() == null ? "" : ri.getUnit().toLowerCase().trim();
        boolean anyAssumed = false;
        PantryItem bestInsufficient = null;

        for (PantryItem candidate : candidates) {
            String pantryUnit = candidate.getUnit() == null ? ""
                    : candidate.getUnit().toLowerCase().trim();

            // Null or missing quantities → assume present, no deduction needed
            if (scaledQty == null || candidate.getQuantity() == null
                    || recipeUnit.isEmpty() || pantryUnit.isEmpty()) {
                return MatchResult.matched(candidate, BigDecimal.ZERO);
            }
            // Check for sufficient quantity of candidates vs ri
            Boolean sufficient = unitConversionService.isSufficient(
                    scaledQty, recipeUnit, candidate.getQuantity(), pantryUnit);

            if (sufficient == null) {
                // Returned null = cross-type, unknown conversion — continue to next candidate
                anyAssumed = true;
                continue;
            }

            if (sufficient) {
                // Convert scaledQty to the pantry item's unit to get deduction amount
                BigDecimal deductionQty = computeDeductionQty(scaledQty, recipeUnit, pantryUnit);
                return MatchResult.matched(candidate, deductionQty != null ? deductionQty : scaledQty);
            }

            // If candidate ingredient found but insufficient qty, set as partial match item
            if (bestInsufficient == null) {
                bestInsufficient = candidate;
            }
        }

        // Resolution order: PARTIAL_MATCH > ASSUMED_AVAILABLE > NO_MATCH
        if (bestInsufficient != null) {
            return MatchResult.partialMatch(bestInsufficient, bestInsufficient.getQuantity());
        }
        return anyAssumed ? MatchResult.assumedAvailable() : MatchResult.noMatch();
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------
    // Finds pantry items that could match recipe ingredient ri
    private List<PantryItem> findCandidates(RecipeIngredient ri,
            Map<Long, List<PantryItem>> pantryByCanonical,
            Map<String, List<PantryItem>> pantryByLowerName) {
        // 1. Try canonical ID match if ri has canonical ingredient linked
        if (ri.getCanonicalIngredient() != null) {
            List<PantryItem> c = pantryByCanonical.get(ri.getCanonicalIngredient().getId());
            if (c != null && !c.isEmpty())
                return c;
        }

        // 2. Alias resolution → try matching ri name against canonical names and
        // aliases
        List<PantryItem> byAlias = ingredientService.resolveByName(ri.getIngredientName())
                .map(ingredient -> pantryByCanonical.get(ingredient.getId()))
                .orElse(null);
        if (byAlias != null && !byAlias.isEmpty())
            return byAlias;

        // 3. Name fallback → check if ri name = pantry item name
        return pantryByLowerName.get(ri.getIngredientName().toLowerCase().trim());
    }

    /**
     * Converts {scaledQty} in {recipeUnit} into {pantryUnit}
     * so the caller can subtract that amount from the pantry item's quantity.
     * Falls back to {scaledQty} unchanged when units are identical.
     */
    private BigDecimal computeDeductionQty(BigDecimal scaledQty,
            String recipeUnit,
            String pantryUnit) {
        if (recipeUnit.equals(pantryUnit))
            return scaledQty;
        return unitConversionService.convert(scaledQty, recipeUnit, pantryUnit);
    }
}
