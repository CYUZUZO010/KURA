package com.budgettracker.dto;

import java.math.BigDecimal;

public record CategoryBreakdownPoint(
        Long categoryId,
        String categoryName,
        String color,
        BigDecimal total,
        double percentage
) {}
