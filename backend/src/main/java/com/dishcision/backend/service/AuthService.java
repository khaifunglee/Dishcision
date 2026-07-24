// This file handles business logic of user authentication requests
package com.dishcision.backend.service;

import com.dishcision.backend.dto.*;
import com.dishcision.backend.exception.ApiException;
import com.dishcision.backend.exception.ErrorCode;
import com.dishcision.backend.model.User;
import com.dishcision.backend.model.UserPreferences;
import com.dishcision.backend.repository.UserPreferencesRepository;
import com.dishcision.backend.repository.UserRepository;
import com.dishcision.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final int MAX_VERIFICATION_ATTEMPTS = 5;
    private static final SecureRandom RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final UserPreferencesRepository userPreferencesRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    // Register — creates an unverified User + default UserPreferences, then
    // emails a 6-digit code. No token is returned yet (see AuthResponse.token).
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.getEmail());
        if (userRepository.existsByEmail(email)) {
            throw new ApiException(ErrorCode.EMAIL_IN_USE, "Email is already in use");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        // Email verification code to verify user
        issueVerificationCode(user);
        userRepository.save(user);

        // Auto-create default user preferences (default values set in model entity)
        UserPreferences prefs = UserPreferences.builder()
                .userId(user.getId())
                .build();
        userPreferencesRepository.save(prefs);

        emailService.sendVerificationCode(user.getEmail(), user.getVerificationCode());

        // No token set — the account isn't usable until the code is verified
        return AuthResponse.builder()
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }

    // Login — verifies credentials and returns token + user info. Blocked until
    // the account's email has been verified.
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(normalizeEmail(request.getEmail()))
                .orElseThrow(() -> new ApiException(ErrorCode.INVALID_CREDENTIALS, "Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ApiException(ErrorCode.INCORRECT_PASSWORD, "Incorrect Password");
        }
        if (!user.isEmailVerified()) {
            throw new ApiException(ErrorCode.EMAIL_NOT_VERIFIED, "Please verify your email before logging in.");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return AuthResponse.builder()
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }

    // Verify email — matches the submitted code, marks the account verified,
    // and returns a real token (equivalent to a first login).
    @Transactional
    public AuthResponse verifyEmail(VerifyEmailRequest request) {
        User user = userRepository.findByEmail(normalizeEmail(request.getEmail()))
                .orElseThrow(() -> new RuntimeException("Invalid email or code"));

        if (user.isEmailVerified()) {
            throw new ApiException(ErrorCode.EMAIL_ALREADY_VERIFIED, "Email is already verified");
        }
        if (user.getVerificationAttempts() >= MAX_VERIFICATION_ATTEMPTS) {
            throw new ApiException(ErrorCode.TOO_MANY_ATTEMPTS, "Too many attempts. Please request a new code.");
        }
        if (user.getVerificationCode() == null
                || user.getVerificationCodeExpiresAt() == null
                || user.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ApiException(ErrorCode.INVALID_CODE, "Code has expired. Please request a new one.");
        }
        if (!user.getVerificationCode().equals(request.getCode())) {
            user.setVerificationAttempts(user.getVerificationAttempts() + 1);
            userRepository.save(user);
            throw new ApiException(ErrorCode.INVALID_CODE, "Incorrect code");
        }
        // Verify email by setting emailVerified=true, clearing verificationCode &
        // expiresAt & attempts
        user.setEmailVerified(true);
        user.setVerificationCode(null);
        user.setVerificationCodeExpiresAt(null);
        user.setVerificationAttempts(0);
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());
        return AuthResponse.builder()
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }

    // Resend verification — regenerates a fresh code and resets the attempt count
    @Transactional
    public void resendVerification(ResendVerificationRequest request) {
        User user = userRepository.findByEmail(normalizeEmail(request.getEmail()))
                .orElseThrow(() -> new RuntimeException("No account found for that email"));

        if (user.isEmailVerified()) {
            throw new ApiException(ErrorCode.EMAIL_ALREADY_VERIFIED, "Email is already verified");
        }
        issueVerificationCode(user);
        userRepository.save(user);
        emailService.sendVerificationCode(user.getEmail(), user.getVerificationCode());
    }

    // Change password
    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verifies current password before changing to new password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new ApiException(ErrorCode.INCORRECT_PASSWORD, "Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    // Update user's display name
    @Transactional
    public AuthResponse updateName(Long userId, String newName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setName(newName);
        userRepository.save(user);
        String token = jwtUtil.generateToken(user.getEmail());
        return AuthResponse.builder()
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }

    // Normalizes email for storage/lookup so case differences don't create
    // duplicate accounts (e.g. Khai@x.com vs khai@x.com)
    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }

    // Generates a fresh 6-digit code + 10-minute expiry and resets attempts
    private void issueVerificationCode(User user) {
        String code = String.format("%06d", RANDOM.nextInt(1_000_000));
        user.setVerificationCode(code);
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(10));
        user.setVerificationAttempts(0);
    }
}
