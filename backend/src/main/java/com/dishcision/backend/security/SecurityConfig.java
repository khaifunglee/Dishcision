// This file serves to configure Spring Security (blocks everything by default)
package com.dishcision.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor

public class SecurityConfig {

    private final JwtFilter jwtFilter;

    // This method serves as a rulebook to filter requests
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable()) // disable CSRF for REST APIs (unnecessary for mobile apps)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // don't create HTTP
                                                                                                  // sessions
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll() // login/register requests are public (don't need to
                                                                 // check token)
                        .anyRequest().authenticated() // everything else needs JWT
                )
                // Run JwtFilter before Spring's own filter to validate and authenticate token
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Method for password hashing
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
