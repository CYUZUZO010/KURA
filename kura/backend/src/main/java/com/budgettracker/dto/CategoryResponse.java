package com.budgettracker.dto;

import com.budgettracker.entity.TransactionType;

public record CategoryResponse(
        Long id,
        String name,
        TransactionType type,
        String color,
        String icon,
        boolean isSystem
) {}
