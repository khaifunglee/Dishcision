// This interface defines DB queries for 'user' table by writing method names
package com.dishcision.backend.repository;

import com.dishcision.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository; // automatically gives save(), findByID(), delete(), etc.
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Define custom queries
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
