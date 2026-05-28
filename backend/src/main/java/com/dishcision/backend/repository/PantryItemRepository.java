// This interface defines DB queries for 'PantryItem' table by writing method names
package com.dishcision.backend.repository;

import com.dishcision.backend.model.PantryItem;
import org.springframework.data.jpa.repository.JpaRepository; // automatically gives save(), findByID(), delete(), etc.
import java.util.List;
import java.util.Optional;

public interface PantryItemRepository extends JpaRepository<PantryItem, Long> {
    // Define custom queries (Spring Data JPA reads the method names and
    // automatically generates the SQL queries)

    // List pantry items for a user, sorted by soonest-expiring first
    List<PantryItem> findByUserIdOrderByExpiryDateAsc(Long userId);

    // Update/delete pantry items for a user
    // Find by pantry item id AND userId to ensure users can only update their own
    // items
    Optional<PantryItem> findByIdAndUserId(Long id, Long userId);
}
