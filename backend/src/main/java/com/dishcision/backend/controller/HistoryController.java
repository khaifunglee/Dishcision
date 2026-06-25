// This file handles HTTP cook-related requests from frontend
package com.dishcision.backend.controller;

import com.dishcision.backend.dto.CookingHistoryDTO;
import com.dishcision.backend.dto.WeeklyStatsDTO;
import com.dishcision.backend.security.UserDetailsImpl;
import com.dishcision.backend.service.CookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class HistoryController {

    private final CookService cookService;

    // GET (200) current user's cooking history, most recent first
    @GetMapping("/history")
    public ResponseEntity<List<CookingHistoryDTO>> getHistory() {
        return ResponseEntity.ok(cookService.getHistory(getCurrentUserId()));
    }

    // GET (200) weekly summary: meals cooked, total saved, most cooked recipe
    @GetMapping("/stats/weekly")
    public ResponseEntity<WeeklyStatsDTO> getWeeklyStats() {
        return ResponseEntity.ok(cookService.getWeeklyStats(getCurrentUserId()));
    }

    // Extracts the authenticated user's ID from the JWT-backed SecurityContext
    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl principal = (UserDetailsImpl) auth.getPrincipal();
        return principal.getId();
    }
}
