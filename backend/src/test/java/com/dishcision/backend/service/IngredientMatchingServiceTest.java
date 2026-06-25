// This file contains test cases for matching recipe ingredients to pantry items
package com.dishcision.backend.service;

import com.dishcision.backend.model.Ingredient;
import com.dishcision.backend.model.PantryItem;
import com.dishcision.backend.model.RecipeIngredient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class IngredientMatchingServiceTest {

    @Mock
    private IngredientService ingredientService;

    private UnitConversionService conversionService;
    private IngredientMatchingService matchingService;

    // Shared test fixtures
    private Ingredient canonicalGarlic;
    private Ingredient canonicalTomato;

    @BeforeEach
    void setUp() {
        conversionService = new UnitConversionService();
        matchingService = new IngredientMatchingService(ingredientService, conversionService);

        canonicalGarlic = Ingredient.builder().id(10L).canonicalName("Garlic").build();
        canonicalTomato = Ingredient.builder().id(20L).canonicalName("Tomato").build();

        // Default: alias resolution returns empty
        when(ingredientService.resolveByName(anyString())).thenReturn(Optional.empty());
    }

    // -------------------------------------------------------------------------
    // Helper builders
    // -------------------------------------------------------------------------
    // Maps a canonical ID ingredient to pantry item
    private PantryItem pantryItem(Long canonicalId, String name, BigDecimal qty, String unit) {
        Ingredient canonical = canonicalId == null ? null
                : Ingredient.builder().id(canonicalId).build();
        return PantryItem.builder()
                .ingredientName(name)
                .canonicalIngredient(canonical)
                .quantity(qty)
                .unit(unit)
                .build();
    }

    // Maps an ingredient to recipe ingredient
    private RecipeIngredient recipeIngredient(Ingredient canonical, String name,
            BigDecimal qty, String unit) {
        return RecipeIngredient.builder()
                .ingredientName(name)
                .canonicalIngredient(canonical)
                .quantity(qty)
                .unit(unit)
                .optional(false)
                .build();
    }

    // Create a pantryByCanonical map - pantry items by canonical ID
    private Map<Long, List<PantryItem>> byCanonical(PantryItem... items) {
        Map<Long, List<PantryItem>> map = new HashMap<>();
        for (PantryItem item : items) {
            if (item.getCanonicalIngredient() != null) {
                map.computeIfAbsent(item.getCanonicalIngredient().getId(),
                        k -> new ArrayList<>()).add(item);
            }
        }
        return map;
    }

    // Create a pantryByLowerName map - pantry items by ingredient name
    private Map<String, List<PantryItem>> byLowerName(PantryItem... items) {
        Map<String, List<PantryItem>> map = new HashMap<>();
        for (PantryItem item : items) {
            map.computeIfAbsent(item.getIngredientName().toLowerCase(), k -> new ArrayList<>())
                    .add(item);
        }
        return map;
    }

    // Test cases
    // -------------------------------------------------------------------------
    // Priority 1: Canonical ID match
    // -------------------------------------------------------------------------

    @Test
    void match_canonicalIdMatch_sameUnit_sufficient_returnsMatched() {
        PantryItem garlic = pantryItem(10L, "Garlic", new BigDecimal("20"), "cloves");
        RecipeIngredient ri = recipeIngredient(canonicalGarlic, "garlic", new BigDecimal("5"), "cloves");

        IngredientMatchingService.MatchResult result = matchingService.match(
                ri, new BigDecimal("5"), byCanonical(garlic), byLowerName(garlic));

        assertEquals(IngredientMatchingService.MatchStatus.MATCHED, result.getStatus());
        assertNotNull(result.getMatchedItem());
        assertEquals(0, new BigDecimal("5").compareTo(result.getDeductionQty()));
    }

    @Test
    void match_canonicalIdMatch_sameUnit_insufficient_returnsNoMatch() {
        PantryItem garlic = pantryItem(10L, "Garlic", new BigDecimal("2"), "cloves");
        RecipeIngredient ri = recipeIngredient(canonicalGarlic, "garlic", new BigDecimal("5"), "cloves");

        IngredientMatchingService.MatchResult result = matchingService.match(
                ri, new BigDecimal("5"), byCanonical(garlic), byLowerName(garlic));

        assertEquals(IngredientMatchingService.MatchStatus.NO_MATCH, result.getStatus());
    }

    @Test
    void match_canonicalIdMatch_crossWeightUnit_sufficient_returnsMatched() {
        // Need 200 g, pantry has 1 kg
        PantryItem flour = pantryItem(10L, "Flour", new BigDecimal("1"), "kg");
        RecipeIngredient ri = recipeIngredient(canonicalGarlic, "flour", new BigDecimal("200"), "g");

        IngredientMatchingService.MatchResult result = matchingService.match(
                ri, new BigDecimal("200"), byCanonical(flour), byLowerName(flour));

        assertEquals(IngredientMatchingService.MatchStatus.MATCHED, result.getStatus());
        // Deduction should be 0.20 kg
        assertTrue(result.getDeductionQty().compareTo(new BigDecimal("0.19")) > 0);
        assertTrue(result.getDeductionQty().compareTo(new BigDecimal("0.21")) < 0);
    }

    @Test
    void match_canonicalIdMatch_countConversion_headsToCloves_returnsMatched() {
        // Recipe: 2 heads garlic; pantry: 20 cloves → sufficient
        PantryItem garlic = pantryItem(10L, "Garlic", new BigDecimal("20"), "cloves");
        RecipeIngredient ri = recipeIngredient(canonicalGarlic, "garlic", new BigDecimal("2"), "heads");

        IngredientMatchingService.MatchResult result = matchingService.match(
                ri, new BigDecimal("2"), byCanonical(garlic), byLowerName(garlic));

        assertEquals(IngredientMatchingService.MatchStatus.MATCHED, result.getStatus());
        // Deduction: 2 heads * 10 cloves/head = 20 cloves
        assertEquals(0, new BigDecimal("20.00").compareTo(result.getDeductionQty()));
    }

    // -------------------------------------------------------------------------
    // Priority 2: Alias match
    // -------------------------------------------------------------------------

    @Test
    void match_aliasMatch_resolvesThroughIngredientService() {
        // ri has no canonical, but "garlic" resolves via alias to canonicalGarlic
        // (id=10)
        PantryItem garlic = pantryItem(10L, "Garlic", new BigDecimal("20"), "cloves");
        RecipeIngredient ri = recipeIngredient(null, "garlic", new BigDecimal("5"), "cloves");
        when(ingredientService.resolveByName("garlic")).thenReturn(Optional.of(canonicalGarlic));

        IngredientMatchingService.MatchResult result = matchingService.match(
                ri, new BigDecimal("5"), byCanonical(garlic), byLowerName(garlic));

        assertEquals(IngredientMatchingService.MatchStatus.MATCHED, result.getStatus());
    }

    // -------------------------------------------------------------------------
    // Priority 3: Name fallback
    // -------------------------------------------------------------------------

    @Test
    void match_nameFallback_caseInsensitive_returnsMatched() {
        // ri has no canonical, alias resolve returns empty, but name matches
        PantryItem olive = pantryItem(null, "Olive Oil", new BigDecimal("500"), "ml");
        RecipeIngredient ri = recipeIngredient(null, "olive oil", new BigDecimal("30"), "ml");

        IngredientMatchingService.MatchResult result = matchingService.match(
                ri, new BigDecimal("30"), byCanonical(), byLowerName(olive));

        assertEquals(IngredientMatchingService.MatchStatus.MATCHED, result.getStatus());
    }

    // -------------------------------------------------------------------------
    // ASSUMED_AVAILABLE: cross-type with no known conversion
    // -------------------------------------------------------------------------

    @Test
    void match_crossTypeMismatch_returnsAssumedAvailable() {
        // Recipe needs 200 g, pantry has 3 pieces — incomparable
        PantryItem chicken = pantryItem(10L, "Chicken", new BigDecimal("3"), "pieces");
        RecipeIngredient ri = recipeIngredient(canonicalGarlic, "chicken", new BigDecimal("200"), "g");

        IngredientMatchingService.MatchResult result = matchingService.match(
                ri, new BigDecimal("200"), byCanonical(chicken), byLowerName(chicken));

        assertEquals(IngredientMatchingService.MatchStatus.ASSUMED_AVAILABLE, result.getStatus());
    }

    // -------------------------------------------------------------------------
    // NO_MATCH: ingredient not in pantry at all
    // -------------------------------------------------------------------------

    @Test
    void match_noCandidates_returnsNoMatch() {
        RecipeIngredient ri = recipeIngredient(canonicalGarlic, "garlic", new BigDecimal("5"), "cloves");

        IngredientMatchingService.MatchResult result = matchingService.match(
                ri, new BigDecimal("5"), byCanonical(), byLowerName());

        assertEquals(IngredientMatchingService.MatchStatus.NO_MATCH, result.getStatus());
    }

    // -------------------------------------------------------------------------
    // Cross-type can→g (known conversion)
    // -------------------------------------------------------------------------

    @Test
    void match_canToGrams_knownCrossType_returnsMatched() {
        // Recipe: 400 g tomatoes; pantry: 1 can
        PantryItem tomato = pantryItem(20L, "Canned Tomatoes", new BigDecimal("1"), "can");
        RecipeIngredient ri = recipeIngredient(canonicalTomato, "canned tomatoes", new BigDecimal("400"), "g");

        IngredientMatchingService.MatchResult result = matchingService.match(
                ri, new BigDecimal("400"), byCanonical(tomato), byLowerName(tomato));

        assertEquals(IngredientMatchingService.MatchStatus.MATCHED, result.getStatus());
        // Deduction: 400g / 400g per can = 1 can
        assertEquals(0, new BigDecimal("1.00").compareTo(result.getDeductionQty()));
    }
}
