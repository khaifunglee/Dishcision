// This file handles business logic of ingredient-related functions
package com.dishcision.backend.service;

import com.dishcision.backend.dto.IngredientSearchResult;
import com.dishcision.backend.model.Ingredient;
import com.dishcision.backend.repository.IngredientAliasRepository;
import com.dishcision.backend.repository.IngredientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IngredientService {

    private final IngredientRepository ingredientRepository;
    private final IngredientAliasRepository aliasRepository;

    // Function for returning a list of canonical ingredient names from inputted
    // ingredient names
    public List<IngredientSearchResult> search(String query) {
        // LinkedHashSet preserves insertion order and deduplicates
        LinkedHashSet<Ingredient> results = new LinkedHashSet<>();

        // Try matching canonical names first (e.g match 'pasta' to Pasta (Penne))
        results.addAll(ingredientRepository.findByCanonicalNameContainingIgnoreCase(query));

        // Try matching with alias names after (e.g match 'penne' to Pasta (Penne))
        aliasRepository.searchByAlias(query)
                .forEach(alias -> results.add(alias.getIngredient()));

        return results.stream()
                .map(this::toSearchResult)
                .collect(Collectors.toList());
    }

    /**
     * Resolves a free-text ingredient name to a canonical Ingredient.
     * Tries canonical name first, then aliases. Returns empty if no match.
     */
    public Optional<Ingredient> resolveByName(String name) {
        Optional<Ingredient> byCanonical = ingredientRepository.findByCanonicalNameIgnoreCase(name);
        if (byCanonical.isPresent())
            return byCanonical;

        return aliasRepository.findByAliasIgnoreCase(name)
                .map(alias -> alias.getIngredient());
    }

    private IngredientSearchResult toSearchResult(Ingredient i) {
        return new IngredientSearchResult(
                i.getId(),
                i.getCanonicalName(),
                i.getDefaultUnit(),
                i.getUnitType(),
                i.getCategory());
    }
}