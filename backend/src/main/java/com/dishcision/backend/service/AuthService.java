// This file handles business logic of user authentication requests
package com.dishcision.backend.service;

import com.dishcision.backend.dto.*;
import com.dishcision.backend.model.User;
import com.dishcision.backend.repository.UserRepository;
import com.dishcision.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor // Uses lombok to generate constructor for final fields

public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // Register method
    public String register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }
        // Create new user model based on register request
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // store hashed passwords
        // Save in user repository
        userRepository.save(user);

        return jwtUtil.generateToken(user.getEmail());
    }

    // Login method
    public String login(LoginRequest request) {
        // Look for registered email, if not found then throw error message
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        // Check if hashed password matches registered password, else throw same error
        // message
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return jwtUtil.generateToken(user.getEmail());
    }
}
