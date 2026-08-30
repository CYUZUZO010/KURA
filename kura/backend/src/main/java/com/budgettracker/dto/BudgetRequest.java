package com.budgettracker.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record BudgetRequest(
        @NotNull Long categoryId,
        @NotNull @Positive BigDecimal monthlyLimit,
        @NotNull @Min(1) @Max(12) Integer periodMonth,
        @NotNull Integer periodYear
) {}
