// This file handles business logic of recipe-related functions
package com.dishcision.backend.service;

import com.dishcision.backend.dto.*;
import com.dishcision.backend.model.*;
import com.dishcision.backend.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final PantryItemRepository pantryItemRepository;
    private final IngredientRepository ingredientRepository;
    private final UserRepository userRepository;
    private final IngredientService ingredientService;
    private final UserSavedRecipeRepository userSavedRecipeRepository;
    private final UserPreferencesRepository userPreferencesRepository;

    // Hard-coded COUNT unit conversions: key="fromUnit:toUnit", value=multiplier.
    private static final Map<String, BigDecimal> COUNT_CONVERSIONS = Map.of(
            "heads:cloves", new BigDecimal("10"),
            "head:cloves", new BigDecimal("10"),
            "heads:clove", new BigDecimal("10"),
            "head:clove", new BigDecimal("10"),
            "cloves:heads", new BigDecimal("0.1"),
            "clove:heads", new BigDecimal("0.1"),
            "cloves:head", new BigDecimal("0.1"),
            "clove:head", new BigDecimal("0.1"));

    // -------------------------------------------------------------------------
    // Public APIs
    // -------------------------------------------------------------------------
    // Fetch recipe list for user
    @Transactional(readOnly = true)
    public List<RecipeSummaryDTO> getRecipes(
            Long userId, String cuisine, Integer maxCookTime, String dietaryTagStr) {

        DietaryTag dietaryTag = parseDietaryTag(dietaryTagStr);
        Map<Long, List<PantryItem>> pantryByCanonical = buildPantryMap(userId);
        // Fetch list of saved recipes for user
        Set<Long> savedIds = buildSavedIds(userId);

        return recipeRepository.findWithFilters(cuisine, maxCookTime, dietaryTag)
                .stream()
                .map(r -> toSummary(r, pantryByCanonical, savedIds))
                .collect(Collectors.toList());
    }

    // Fetch a single recipe's details
    @Transactional(readOnly = true)
    public RecipeDetailDTO getRecipeDetail(Long userId, Long recipeId) {
        Recipe recipe = recipeRepository.findByIdWithIngredients(recipeId)
                .orElseThrow(() -> new EntityNotFoundException("Recipe not found: " + recipeId));
        Map<Long, List<PantryItem>> pantryByCanonical = buildPantryMap(userId);
        Set<Long> savedIds = buildSavedIds(userId);
        return toDetail(recipe, pantryByCanonical, savedIds);
    }

    // Fetch recipe suggestions (matched with recipe items)
    // Filtered by the user's diet_tags if present
    @Transactional(readOnly = true)
    public SuggestionsResponse getSuggestions(Long userId) {
        Map<Long, List<PantryItem>> pantryByCanonical = buildPantryMap(userId);
        Set<Long> savedIds = buildSavedIds(userId);
        Set<DietaryTag> userDietTags = getUserDietTags(userId);
        int pantryCount = pantryItemRepository.findByUserIdOrderByExpiryDateAsc(userId).size();
        // List of full or near matched recipes
        List<RecipeSummaryDTO> fullMatch = new ArrayList<>();
        List<RecipeSummaryDTO> nearMatch = new ArrayList<>();

        // Load all recipes with ingredients, iterate through them with matching
        // algorithm
        for (Recipe recipe : recipeRepository.findAllWithIngredients()) {
            // Skip recipes that don't satisfy the user's dietary requirements
            if (!userDietTags.isEmpty() && !recipe.getDietaryTags().containsAll(userDietTags)) {
                continue;
            }
            RecipeSummaryDTO summary = toSummary(recipe, pantryByCanonical, savedIds);
            int missing = summary.getMissingIngredients().size();
            // Sort each recipe into full or near match recipes
            if (missing == 0)
                fullMatch.add(summary);
            else if (missing <= 2)
                nearMatch.add(summary);
        }

        return SuggestionsResponse.builder()
                .pantryItemCount(pantryCount)
                .fullMatch(fullMatch)
                .nearMatch(nearMatch)
                .build();
    }

    // Save a recipe for the current user — idempotent (return without error if
    // saving multiple times)
    @Transactional
    public void saveRecipe(Long userId, Long recipeId) {
        if (!recipeRepository.existsById(recipeId)) {
            throw new EntityNotFoundException("Recipe not found: " + recipeId);
        }
        if (!userSavedRecipeRepository.existsByUserIdAndRecipeId(userId, recipeId)) {
            userSavedRecipeRepository.save(
                    UserSavedRecipe.builder()
                            .userId(userId)
                            .recipeId(recipeId)
                            .build());
        }
    }

    // Unsave a recipe — 204 whether or not it was saved
    @Transactional
    public void unsaveRecipe(Long userId, Long recipeId) {
        userSavedRecipeRepository.deleteByUserIdAndRecipeId(userId, recipeId);
    }

    // Fetch a list of saved recipes
    @Transactional(readOnly = true)
    public List<RecipeSummaryDTO> getSavedRecipes(Long userId) {
        Set<Long> savedIds = buildSavedIds(userId);
        if (savedIds.isEmpty())
            return Collections.emptyList();

        Map<Long, List<PantryItem>> pantryByCanonical = buildPantryMap(userId);
        return recipeRepository.findAllById(savedIds)
                .stream()
                .map(r -> toSummary(r, pantryByCanonical, savedIds))
                .collect(Collectors.toList());
    }

    // Create a recipe - converts DTO into Recipe entity + Recipe Ingredient child
    // entities
    @Transactional
    public RecipeDetailDTO createRecipe(Long userId, RecipeRequest request) {
        userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Set<DietaryTag> tags = request.getDietaryTags() == null ? new HashSet<>()
                : request.getDietaryTags().stream()
                        .map(s -> DietaryTag.valueOf(s.toUpperCase()))
                        .collect(Collectors.toSet());

        Recipe recipe = Recipe.builder()
                .name(request.getName())
                .cuisine(request.getCuisine())
                .cookTimeMins(request.getCookTimeMins())
                .servings(request.getServings())
                .costPerServe(request.getCostPerServe())
                .calories(request.getCalories())
                .imageUrl(request.getImageUrl())
                .source(RecipeSource.USER_ADDED)
                .createdByUserId(userId)
                .dietaryTags(tags)
                .steps(request.getSteps() != null ? request.getSteps() : new ArrayList<>())
                .build();

        // If request doesn't have recipe ingredient DTO, build the ingredient request
        // DTO manually
        if (request.getIngredients() != null) {
            for (RecipeIngredientRequest ri : request.getIngredients()) {
                Ingredient canonical = ri.getCanonicalIngredientId() != null
                        ? ingredientRepository.findById(ri.getCanonicalIngredientId()).orElse(null)
                        : null;
                RecipeIngredient ingredient = RecipeIngredient.builder()
                        .recipe(recipe)
                        .ingredientName(ri.getIngredientName())
                        .canonicalIngredient(canonical)
                        .quantity(ri.getQuantity())
                        .unit(ri.getUnit())
                        .optional(ri.isOptional())
                        .notes(ri.getNotes())
                        .build();
                recipe.getIngredients().add(ingredient);
            }
        }
        // Save recipe to DB
        Recipe saved = recipeRepository.save(recipe);
        Map<Long, List<PantryItem>> pantryByCanonical = buildPantryMap(userId);
        Set<Long> savedIds = buildSavedIds(userId);
        return toDetail(saved, pantryByCanonical, savedIds);
    }

    // -------------------------------------------------------------------------
    // DTO mapping
    // -------------------------------------------------------------------------
    // Map recipe entities to recipe summary DTO (serializable objects)
    private RecipeSummaryDTO toSummary(Recipe recipe,
            Map<Long, List<PantryItem>> pantryByCanonical, Set<Long> savedIds) {
        // Build required ingredients for the recipe
        List<RecipeIngredient> required = recipe.getIngredients().stream()
                .filter(ri -> !ri.isOptional())
                .collect(Collectors.toList());
        // Calculate missing ingredients with computeMissing
        List<MissingIngredientDTO> missing = computeMissing(required, pantryByCanonical);

        return RecipeSummaryDTO.builder()
                .id(recipe.getId())
                .name(recipe.getName())
                .cuisine(recipe.getCuisine())
                .cookTimeMins(recipe.getCookTimeMins())
                .servings(recipe.getServings())
                .costPerServe(recipe.getCostPerServe())
                .calories(recipe.getCalories())
                .imageUrl(recipe.getImageUrl())
                .dietaryTags(recipe.getDietaryTags().stream().map(Enum::name).collect(Collectors.toList()))
                .matchedCount(required.size() - missing.size())
                .totalRequired(required.size())
                .missingIngredients(missing)
                .saved(savedIds.contains(recipe.getId())) // checks whether recipe is saved
                .build();
    }

    // Map recipe entities to recipe detail DTO
    private RecipeDetailDTO toDetail(Recipe recipe,
            Map<Long, List<PantryItem>> pantryByCanonical, Set<Long> savedIds) {
        List<RecipeIngredient> required = recipe.getIngredients().stream()
                .filter(ri -> !ri.isOptional())
                .collect(Collectors.toList());

        List<MissingIngredientDTO> missing = computeMissing(required, pantryByCanonical);

        List<RecipeIngredientDTO> ingredientDtos = recipe.getIngredients().stream()
                .map(ri -> RecipeIngredientDTO.builder()
                        .id(ri.getId())
                        .ingredientName(ri.getIngredientName())
                        .canonicalIngredientId(ri.getCanonicalIngredient() != null
                                ? ri.getCanonicalIngredient().getId()
                                : null)
                        .quantity(ri.getQuantity())
                        .unit(ri.getUnit())
                        .optional(ri.isOptional())
                        .notes(ri.getNotes())
                        .inPantry(!ri.isOptional() && isAvailable(ri, pantryByCanonical))
                        .build())
                .collect(Collectors.toList());

        return RecipeDetailDTO.builder()
                .id(recipe.getId())
                .name(recipe.getName())
                .cuisine(recipe.getCuisine())
                .cookTimeMins(recipe.getCookTimeMins())
                .servings(recipe.getServings())
                .costPerServe(recipe.getCostPerServe())
                .calories(recipe.getCalories())
                .imageUrl(recipe.getImageUrl())
                .source(recipe.getSource().name())
                .dietaryTags(recipe.getDietaryTags().stream().map(Enum::name).collect(Collectors.toList()))
                .ingredients(ingredientDtos)
                .steps(recipe.getSteps())
                .matchedCount(required.size() - missing.size())
                .totalRequired(required.size())
                .missingIngredients(missing)
                .saved(savedIds.contains(recipe.getId())) // checks whether recipe is saved
                .build();
    }

    // -------------------------------------------------------------------------
    // Matching algorithm
    // -------------------------------------------------------------------------
    // Calculate missing ingredients from a user's pantry for a recipe
    private List<MissingIngredientDTO> computeMissing(
            List<RecipeIngredient> required,
            Map<Long, List<PantryItem>> pantryByCanonical) {

        return required.stream()
                .filter(ri -> !isAvailable(ri, pantryByCanonical)) // find ingredients that aren't in pantry
                .map(ri -> MissingIngredientDTO.builder()
                        .ingredientName(ri.getIngredientName())
                        .quantity(ri.getQuantity())
                        .unit(ri.getUnit())
                        .build())
                .collect(Collectors.toList());
    }

    // Function to check if an ingredient is present in pantry
    // Handles potential unit/name mismatches between recipe vs pantry ingredients
    private boolean isAvailable(RecipeIngredient ri,
            Map<Long, List<PantryItem>> pantryByCanonical) {
        // Look for similar ingredients in pantry vs recipe
        List<PantryItem> candidates = findCandidates(ri, pantryByCanonical);
        if (candidates == null || candidates.isEmpty())
            return false;
        // If recipe ingredient is present, check if each has enough qty
        for (PantryItem candidate : candidates) {
            if (hasSufficientQuantity(ri.getQuantity(), ri.getUnit(),
                    candidate.getQuantity(), candidate.getUnit())) {
                return true;
            }
        }
        return false;
    }

    // Finds pantry items that could satisfy this recipe ingredient
    // Tries canonical ID first, then alias-based fuzzy resolution
    private List<PantryItem> findCandidates(RecipeIngredient ri,
            Map<Long, List<PantryItem>> pantryByCanonical) {
        // Tries canonical matching first (if ri has a canonical ingredient linked)
        if (ri.getCanonicalIngredient() != null) {
            return pantryByCanonical.get(ri.getCanonicalIngredient().getId());
        }
        // Otherwise tries matching ri against canonical names and aliases
        return ingredientService.resolveByName(ri.getIngredientName())
                .map(ingredient -> pantryByCanonical.get(ingredient.getId()))
                .orElse(null);
    }

    // Returns true if available ingredient qty is sufficient, accounting for unit
    // conversion within same measurement group
    private boolean hasSufficientQuantity(BigDecimal needed, String neededUnit,
            BigDecimal available, String availableUnit) {
        // Either req or avail qty is null = assume present (no qty restriction)
        if (needed == null || available == null)
            return true;
        // Either req or avail unit is null - assume resent (can't compare)
        if (neededUnit == null || availableUnit == null)
            return true;

        String nu = neededUnit.toLowerCase().trim();
        String au = availableUnit.toLowerCase().trim();

        if (nu.equals(au))
            return available.compareTo(needed) >= 0;

        UnitGroup ng = getUnitGroup(nu);
        UnitGroup ag = getUnitGroup(au);

        if (ng == null || ag == null)
            return true; // unrecognized unit = assume available
        if (ng != ag)
            return true; // cross-type (e.g g vs pieces) = assume available

        // Same unit group: convert to base unit
        // Diff unit group: assume present (can't compare 200g vs 200ml)
        return switch (ng) {
            case WEIGHT -> {
                BigDecimal nG = toGrams(needed, nu);
                BigDecimal aG = toGrams(available, au);
                yield (nG == null || aG == null) || aG.compareTo(nG) >= 0;
            }
            case VOLUME -> {
                BigDecimal nMl = toMl(needed, nu);
                BigDecimal aMl = toMl(available, au);
                yield (nMl == null || aMl == null) || aMl.compareTo(nMl) >= 0;
            }
            case COUNT -> {
                // Known conversion: apply multiplier (e.g: 1 head * 10 = 10 cloves)
                BigDecimal factor = COUNT_CONVERSIONS.get(au + ":" + nu);
                // Unknown conversion: assume available over incorrectly failing
                yield factor == null || available.multiply(factor).compareTo(needed) >= 0;
            }
        };
    }

    // -------------------------------------------------------------------------
    // Unit conversion helpers
    // -------------------------------------------------------------------------

    private enum UnitGroup {
        WEIGHT, VOLUME, COUNT
    }

    // Hardcodes allocaiton of unit names to unit group
    private UnitGroup getUnitGroup(String unit) {
        return switch (unit) {
            case "g", "kg", "oz", "lb" -> UnitGroup.WEIGHT;
            case "ml", "l", "tsp", "tbsp", "cup", "cups" -> UnitGroup.VOLUME;
            case "pieces", "piece", "cloves", "clove",
                    "heads", "head", "bunches", "bunch", "cans", "can" ->
                UnitGroup.COUNT;
            default -> null;
        };
    }

    // Conversion calculator to grams
    private BigDecimal toGrams(BigDecimal qty, String unit) {
        return switch (unit) {
            case "g" -> qty;
            case "kg" -> qty.multiply(new BigDecimal("1000"));
            case "oz" -> qty.multiply(new BigDecimal("28.3495"));
            case "lb" -> qty.multiply(new BigDecimal("453.592"));
            default -> null;
        };
    }

    // Conversion calculator to ml
    private BigDecimal toMl(BigDecimal qty, String unit) {
        return switch (unit) {
            case "ml" -> qty;
            case "l" -> qty.multiply(new BigDecimal("1000"));
            case "tsp" -> qty.multiply(new BigDecimal("4.92892"));
            case "tbsp" -> qty.multiply(new BigDecimal("14.7868"));
            case "cup", "cups" -> qty.multiply(new BigDecimal("236.588"));
            default -> null;
        };
    }

    // -------------------------------------------------------------------------
    // Utility
    // -------------------------------------------------------------------------

    // Groups pantry items by canonical ingredient ID during matching
    // Required for easy lookups for recipe matching info in toSummary/toDetail
    private Map<Long, List<PantryItem>> buildPantryMap(Long userId) {
        Map<Long, List<PantryItem>> map = new HashMap<>();
        // Get user's pantry items ordered by expiring date
        for (PantryItem item : pantryItemRepository.findByUserIdOrderByExpiryDateAsc(userId)) {
            if (item.getCanonicalIngredient() != null) {
                map.computeIfAbsent(item.getCanonicalIngredient().getId(), k -> new ArrayList<>())
                        .add(item);
            }
        }
        return map;
    }

    // Build set of saved recipe IDs for user
    // Required for easy lookups to check for saved in toSummary/toDetail
    private Set<Long> buildSavedIds(Long userId) {
        return userSavedRecipeRepository.findByUserId(userId)
                .stream()
                .map(UserSavedRecipe::getRecipeId)
                .collect(Collectors.toSet());
    }

    // Retrieve user's diet tags for suggestion filtering
    // Empty set = no filter
    private Set<DietaryTag> getUserDietTags(Long userId) {
        return userPreferencesRepository.findByUserId(userId)
                .map(UserPreferences::getDietTags)
                .orElse(Collections.emptySet());
    }

    private DietaryTag parseDietaryTag(String str) {
        if (str == null || str.isBlank())
            return null;
        try {
            return DietaryTag.valueOf(str.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
