package com.budgettracker.dto;

import java.math.BigDecimal;

public record MonthlyTrendPoint(
        String month,
        BigDecimal income,
        BigDecimal expenses
) {}
