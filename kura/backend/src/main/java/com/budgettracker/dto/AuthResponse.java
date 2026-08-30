package com.budgettracker.dto;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        UserResponse user
) {}
