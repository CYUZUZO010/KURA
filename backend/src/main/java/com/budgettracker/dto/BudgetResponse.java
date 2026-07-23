package com.budgettracker.dto;

import java.math.BigDecimal;

public record BudgetResponse(
        Long id,
        Long categoryId,
        String categoryName,
        String categoryColor,
        BigDecimal monthlyLimit,
        BigDecimal spent,
        BigDecimal remaining,
        double percentUsed,
        Integer periodMonth,
        Integer periodYear
) {}
