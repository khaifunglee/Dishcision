// This file intercepts incoming requests to check JWT matches
package com.dishcision.backend.security;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor

public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response, FilterChain chain) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            // Extract token
            String token = header.substring(7);

            // Validate token by verifying the signature matches
            if (jwtUtil.isTokenValid(token)) {
                String email = jwtUtil.extractEmail(token);
                // Authenticates request and forwards to AuthController.java
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(email, null,
                        List.of());
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        chain.doFilter(request, response); // Always continue to next request
    }
}
