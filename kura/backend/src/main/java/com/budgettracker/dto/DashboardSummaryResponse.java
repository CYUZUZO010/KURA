package com.budgettracker.dto;

import java.math.BigDecimal;
import java.util.List;

public record DashboardSummaryResponse(
        BigDecimal totalIncome,
        BigDecimal totalExpenses,
        BigDecimal netSavings,
        double savingsRate,
        List<MonthlyTrendPoint> monthlyTrend,
        List<CategoryBreakdownPoint> categoryBreakdown,
        List<BudgetResponse> budgetStatus
) {}
