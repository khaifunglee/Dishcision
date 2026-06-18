// This interface defines DB queries for user_preferences table
package com.dishcision.backend.repository;

import com.dishcision.backend.model.UserPreferences;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserPreferencesRepository extends JpaRepository<UserPreferences, Long> {
    Optional<UserPreferences> findByUserId(Long userId);

    boolean existsByUserId(Long userId);
}
