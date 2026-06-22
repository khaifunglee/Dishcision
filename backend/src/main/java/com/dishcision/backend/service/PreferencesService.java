// This file handles business logic for user preferences
package com.dishcision.backend.service;

import com.dishcision.backend.dto.UserPreferencesRequest;
import com.dishcision.backend.dto.UserPreferencesResponse;
import com.dishcision.backend.model.AllergyTag;
import com.dishcision.backend.model.DietaryTag;
import com.dishcision.backend.model.TextSize;
import com.dishcision.backend.model.UserPreferences;
import com.dishcision.backend.repository.UserPreferencesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PreferencesService {

    private final UserPreferencesRepository userPreferencesRepository;

    // Get user preferences
    @Transactional
    public UserPreferencesResponse getPreferences(Long userId) {
        UserPreferences prefs = findOrCreate(userId);
        return toResponse(prefs);
    }

    // Partial update (idempotent), only overwrite fields that are non-null in the
    // request
    @Transactional
    public UserPreferencesResponse updatePreferences(Long userId, UserPreferencesRequest request) {
        UserPreferences prefs = findOrCreate(userId);

        if (request.getDietTags() != null) {
            Set<DietaryTag> tags = request.getDietTags().stream()
                    .map(s -> DietaryTag.valueOf(s.toUpperCase()))
                    .collect(Collectors.toSet());
            prefs.setDietTags(tags);
        }
        if (request.getAllergyTags() != null) {
            Set<AllergyTag> tags = request.getAllergyTags().stream()
                    .map(s -> AllergyTag.valueOf(s.toUpperCase()))
                    .collect(Collectors.toSet());
            prefs.setAllergyTags(tags);
        }
        // Expiry alert days, daily suggestion, budget per serve, allergy tags functions
        // to be implemented in later Sprints
        if (request.getExpiryAlertDays() != null) {
            prefs.setExpiryAlertDays(request.getExpiryAlertDays());
        }
        if (request.getDailySuggestionOn() != null) {
            prefs.setDailySuggestionOn(request.getDailySuggestionOn());
        }
        if (request.getTextSize() != null) {
            prefs.setTextSize(TextSize.valueOf(request.getTextSize().toUpperCase()));
        }
        if (request.getBudgetPerServe() != null) {
            prefs.setBudgetPerServe(request.getBudgetPerServe());
        }

        return toResponse(userPreferencesRepository.save(prefs));
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------
    // Get/create preferences for user (create for old users with no user_pref row)
    private UserPreferences findOrCreate(Long userId) {
        return userPreferencesRepository.findByUserId(userId)
                .orElseGet(() -> userPreferencesRepository.save(
                        UserPreferences.builder().userId(userId).build()));
    }

    // Maps UserPreference entities to user preference response DTO
    private UserPreferencesResponse toResponse(UserPreferences prefs) {
        List<String> dietTags = prefs.getDietTags().stream()
                .map(Enum::name)
                .collect(Collectors.toList());
        List<String> allergyTags = prefs.getAllergyTags().stream()
                .map(Enum::name)
                .collect(Collectors.toList());

        return UserPreferencesResponse.builder()
                .id(prefs.getId())
                .dietTags(dietTags)
                .allergyTags(allergyTags)
                .expiryAlertDays(prefs.getExpiryAlertDays())
                .dailySuggestionOn(prefs.isDailySuggestionOn())
                .textSize(prefs.getTextSize().name())
                .budgetPerServe(prefs.getBudgetPerServe())
                .build();
    }
}
