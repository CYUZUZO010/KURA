package com.budgettracker.dto;

import com.budgettracker.entity.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CategoryRequest(
        @NotBlank String name,
        @NotNull TransactionType type,
        String color,
        String icon
) {}
