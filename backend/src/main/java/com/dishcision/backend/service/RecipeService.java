// This file handles business logic of recipe-related functions
package com.dishcision.backend.service;

import com.dishcision.backend.dto.*;
import com.dishcision.backend.model.*;
import com.dishcision.backend.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final PantryItemRepository pantryItemRepository;
    private final IngredientRepository ingredientRepository;
    private final UserRepository userRepository;
    private final UserSavedRecipeRepository userSavedRecipeRepository;
    private final UserPreferencesRepository userPreferencesRepository;
    private final IngredientMatchingService matchingService;

    // -------------------------------------------------------------------------
    // Public APIs
    // -------------------------------------------------------------------------
    // Fetch recipe list for user
    @Transactional(readOnly = true)
    public List<RecipeSummaryDTO> getRecipes(
            Long userId, String cuisine, Integer maxCookTime, String dietaryTagStr) {

        DietaryTag dietaryTag = parseDietaryTag(dietaryTagStr);
        List<PantryItem> pantry = pantryItemRepository.findByUserIdOrderByExpiryDateAsc(userId);
        Map<Long, List<PantryItem>> pantryByCanonical = buildPantryByCanonical(pantry);
        Map<String, List<PantryItem>> pantryByLowerName = buildPantryByName(pantry);
        // Fetch list of saved recipes for user
        Set<Long> savedIds = buildSavedIds(userId);

        return recipeRepository.findWithFilters(cuisine, maxCookTime, dietaryTag)
                .stream()
                .map(r -> toSummary(r, pantryByCanonical, pantryByLowerName, savedIds))
                .collect(Collectors.toList());
    }

    // Fetch a single recipe's details
    @Transactional(readOnly = true)
    public RecipeDetailDTO getRecipeDetail(Long userId, Long recipeId) {
        Recipe recipe = recipeRepository.findByIdWithIngredients(recipeId)
                .orElseThrow(() -> new EntityNotFoundException("Recipe not found: " + recipeId));
        List<PantryItem> pantry = pantryItemRepository.findByUserIdOrderByExpiryDateAsc(userId);
        Map<Long, List<PantryItem>> pantryByCanonical = buildPantryByCanonical(pantry);
        Map<String, List<PantryItem>> pantryByLowerName = buildPantryByName(pantry);
        Set<Long> savedIds = buildSavedIds(userId);
        return toDetail(recipe, pantryByCanonical, pantryByLowerName, savedIds);
    }

    // Fetch recipe suggestions (matched with recipe items)
    // Filtered by the user's diet_tags if present
    @Transactional(readOnly = true)
    public SuggestionsResponse getSuggestions(Long userId) {
        List<PantryItem> pantry = pantryItemRepository.findByUserIdOrderByExpiryDateAsc(userId);
        Map<Long, List<PantryItem>> pantryByCanonical = buildPantryByCanonical(pantry);
        Map<String, List<PantryItem>> pantryByLowerName = buildPantryByName(pantry);
        Set<Long> savedIds = buildSavedIds(userId);
        Set<DietaryTag> userDietTags = getUserDietTags(userId);
        // List of full or near matched recipes
        List<RecipeSummaryDTO> fullMatch = new ArrayList<>();
        List<RecipeSummaryDTO> nearMatch = new ArrayList<>();
        List<Recipe> allRecipes = recipeRepository.findAllWithIngredients();

        // Load all recipes with ingredients, iterate through them with matching
        // algorithm
        for (Recipe recipe : allRecipes) {
            // Skip recipes that don't satisfy user's dietary requirements
            if (!userDietTags.isEmpty() && !recipe.getDietaryTags().containsAll(userDietTags)) {
                continue;
            }
            RecipeSummaryDTO summary = toSummary(recipe, pantryByCanonical, pantryByLowerName, savedIds);
            int missing = summary.getMissingIngredients().size();
            // Sort each recipe into full or near match recipes
            if (missing == 0)
                fullMatch.add(summary);
            else if (missing <= 2)
                nearMatch.add(summary);
        }

        return SuggestionsResponse.builder()
                .pantryItemCount(pantry.size())
                .totalRecipes((int) recipeRepository.count())
                .fullMatch(fullMatch)
                .nearMatch(nearMatch)
                .build();
    }

    // Save a recipe for current user
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

    // Unsave a recipe
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

        List<PantryItem> pantry = pantryItemRepository.findByUserIdOrderByExpiryDateAsc(userId);
        Map<Long, List<PantryItem>> pantryByCanonical = buildPantryByCanonical(pantry);
        Map<String, List<PantryItem>> pantryByLowerName = buildPantryByName(pantry);

        return recipeRepository.findAllById(savedIds)
                .stream()
                .map(r -> toSummary(r, pantryByCanonical, pantryByLowerName, savedIds))
                .collect(Collectors.toList());
    }

    // Create a recipe - convers DTO into Recipe entity + Recipe Ingredient child
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
        // If request doesn't have recipe ingredient DTO, build it manually
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
        List<PantryItem> pantry = pantryItemRepository.findByUserIdOrderByExpiryDateAsc(userId);
        Map<Long, List<PantryItem>> pantryByCanonical = buildPantryByCanonical(pantry);
        Map<String, List<PantryItem>> pantryByLowerName = buildPantryByName(pantry);
        Set<Long> savedIds = buildSavedIds(userId);
        return toDetail(saved, pantryByCanonical, pantryByLowerName, savedIds);
    }

    // -------------------------------------------------------------------------
    // DTO mapping
    // -------------------------------------------------------------------------
    // Map recipe entities to recipe summary DTO (serializable objects)
    private RecipeSummaryDTO toSummary(Recipe recipe,
            Map<Long, List<PantryItem>> pantryByCanonical,
            Map<String, List<PantryItem>> pantryByLowerName,
            Set<Long> savedIds) {
        // Build required ingreidents for the recipe
        List<RecipeIngredient> required = recipe.getIngredients().stream()
                .filter(ri -> !ri.isOptional())
                .collect(Collectors.toList());
        // Calculate missing ingredients
        List<MissingIngredientDTO> missing = computeMissing(required, pantryByCanonical, pantryByLowerName);

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
                .saved(savedIds.contains(recipe.getId()))
                .build();
    }

    // Map recipe entities to recipe detail DTO
    private RecipeDetailDTO toDetail(Recipe recipe,
            Map<Long, List<PantryItem>> pantryByCanonical,
            Map<String, List<PantryItem>> pantryByLowerName,
            Set<Long> savedIds) {

        List<RecipeIngredient> required = recipe.getIngredients().stream()
                .filter(ri -> !ri.isOptional())
                .collect(Collectors.toList());

        List<MissingIngredientDTO> missing = computeMissing(required, pantryByCanonical, pantryByLowerName);

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
                        .inPantry(!ri.isOptional() && isAvailable(ri, pantryByCanonical, pantryByLowerName))
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
                .saved(savedIds.contains(recipe.getId()))
                .build();
    }

    // -------------------------------------------------------------------------
    // Matching Algorithm (delegates to IngredientMatchingService)
    // -------------------------------------------------------------------------
    // Calculate missing ingredients from a user's pantry for a recipe
    private List<MissingIngredientDTO> computeMissing(
            List<RecipeIngredient> required,
            Map<Long, List<PantryItem>> pantryByCanonical,
            Map<String, List<PantryItem>> pantryByLowerName) {
        // Only return ingredients that give NO_MATCH match status
        return required.stream()
                .filter(ri -> matchingService.match(
                        ri, ri.getQuantity(), pantryByCanonical, pantryByLowerName)
                        .getStatus() == IngredientMatchingService.MatchStatus.NO_MATCH)
                .map(ri -> MissingIngredientDTO.builder()
                        .ingredientName(ri.getIngredientName())
                        .quantity(ri.getQuantity())
                        .unit(ri.getUnit())
                        .build())
                .collect(Collectors.toList());
    }

    // Check if an ingredient is present in pantry
    // MATCHED or ASSUMED_AVAILABLE both count as "in pantry" for display purposes
    private boolean isAvailable(RecipeIngredient ri,
            Map<Long, List<PantryItem>> pantryByCanonical,
            Map<String, List<PantryItem>> pantryByLowerName) {
        return matchingService.match(ri, ri.getQuantity(), pantryByCanonical, pantryByLowerName)
                .getStatus() != IngredientMatchingService.MatchStatus.NO_MATCH;
    }

    // -------------------------------------------------------------------------
    // Utility
    // -------------------------------------------------------------------------
    // Groups pantry items by canonical ingredient ID during matching
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

    // Group pantry items by ingredient name
    private Map<String, List<PantryItem>> buildPantryByName(List<PantryItem> pantry) {
        Map<String, List<PantryItem>> map = new HashMap<>();
        for (PantryItem item : pantry) {
            map.computeIfAbsent(item.getIngredientName().toLowerCase(),
                    k -> new ArrayList<>()).add(item);
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
