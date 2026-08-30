package com.budgettracker.dto;

public record UserResponse(
        Long id,
        String email,
        String fullName,
        String currency
) {}
