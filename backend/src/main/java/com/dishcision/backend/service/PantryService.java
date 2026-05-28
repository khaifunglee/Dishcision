// This file handles business logic of pantry-related functions
package com.dishcision.backend.service;

import com.dishcision.backend.dto.PantryItemRequest;
import com.dishcision.backend.dto.PantryItemResponse;
import com.dishcision.backend.model.PantryItem;
import com.dishcision.backend.model.User;
import com.dishcision.backend.repository.PantryItemRepository;
import com.dishcision.backend.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PantryService {

    private final PantryItemRepository pantryItemRepository;
    private final UserRepository userRepository;
    private final IngredientService ingredientService;

    // Funciton for retrieving pantry list for a user
    @Transactional(readOnly = true)
    public List<PantryItemResponse> getPantryForUser(Long userId) {
        return pantryItemRepository.findByUserIdOrderByExpiryDateAsc(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // Function for adding an ingredient to a user's panry
    @Transactional
    public PantryItemResponse addItem(Long userId, PantryItemRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        PantryItem item = PantryItem.builder()
                .user(user)
                .ingredientName(request.getIngredientName())
                .quantity(request.getQuantity())
                .unit(request.getUnit())
                .expiryDate(request.getExpiryDate())
                .category(request.getCategory())
                .build();

        // Attempt canonical resolution — silent no-op if no match
        ingredientService.resolveByName(request.getIngredientName())
                .ifPresent(item::setCanonicalIngredient);

        return toResponse(pantryItemRepository.save(item));
    }

    // Function for editing an ingredient in a user's pantry
    @Transactional
    public PantryItemResponse updateItem(Long userId, Long itemId, PantryItemRequest request) {
        PantryItem item = pantryItemRepository.findByIdAndUserId(itemId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Pantry item not found or access denied"));

        item.setIngredientName(request.getIngredientName());
        item.setQuantity(request.getQuantity());
        item.setUnit(request.getUnit());
        item.setExpiryDate(request.getExpiryDate());
        item.setCategory(request.getCategory());

        // Re-resolve if name changed
        item.setCanonicalIngredient(
                ingredientService.resolveByName(request.getIngredientName()).orElse(null));

        return toResponse(pantryItemRepository.save(item));
    }

    // Function for deleting an ingredient in a user's pantry
    @Transactional
    public void deleteItem(Long userId, Long itemId) {
        PantryItem item = pantryItemRepository.findByIdAndUserId(itemId, userId)
                .orElseThrow(() -> new EntityNotFoundException("Pantry item not found or access denied"));
        pantryItemRepository.delete(item);
    }

    // Function for creating a pantry item response DTO to return to frontend
    private PantryItemResponse toResponse(PantryItem item) {
        PantryItemResponse response = new PantryItemResponse();
        response.setId(item.getId());
        response.setIngredientName(item.getIngredientName());
        response.setQuantity(item.getQuantity());
        response.setUnit(item.getUnit());
        response.setExpiryDate(item.getExpiryDate());
        response.setCategory(item.getCategory());
        response.setCreatedAt(item.getCreatedAt());
        response.setUpdatedAt(item.getUpdatedAt());

        if (item.getCanonicalIngredient() != null) {
            response.setCanonicalIngredientId(item.getCanonicalIngredient().getId());
            response.setUnitType(item.getCanonicalIngredient().getUnitType());
        }
        return response;
    }
}
