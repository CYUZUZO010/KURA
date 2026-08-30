package com.budgettracker.service;

import com.budgettracker.dto.*;
import com.budgettracker.entity.Category;
import com.budgettracker.entity.TransactionType;
import com.budgettracker.repository.CategoryRepository;
import com.budgettracker.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final BudgetService budgetService;

    public AnalyticsService(TransactionRepository transactionRepository,
                             CategoryRepository categoryRepository,
                             BudgetService budgetService) {
        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
        this.budgetService = budgetService;
    }

    public DashboardSummaryResponse getDashboardSummary(Long userId, int month, int year) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        BigDecimal income = transactionRepository.sumByUserAndTypeBetween(userId, TransactionType.INCOME, start, end);
        BigDecimal expenses = transactionRepository.sumByUserAndTypeBetween(userId, TransactionType.EXPENSE, start, end);
        BigDecimal net = income.subtract(expenses);
        double savingsRate = income.compareTo(BigDecimal.ZERO) > 0
                ? net.divide(income, 4, RoundingMode.HALF_UP).doubleValue() * 100
                : 0;

        List<MonthlyTrendPoint> trend = buildTrend(userId, ym);
        List<CategoryBreakdownPoint> breakdown = buildCategoryBreakdown(userId, start, end, expenses);
        List<BudgetResponse> budgetStatus = budgetService.getForPeriod(userId, month, year);

        return new DashboardSummaryResponse(
                income, expenses, net, Math.round(savingsRate * 10) / 10.0, trend, breakdown, budgetStatus
        );
    }

    private List<MonthlyTrendPoint> buildTrend(Long userId, YearMonth currentMonth) {
        List<MonthlyTrendPoint> points = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            YearMonth ym = currentMonth.minusMonths(i);
            LocalDate start = ym.atDay(1);
            LocalDate end = ym.atEndOfMonth();
            BigDecimal income = transactionRepository.sumByUserAndTypeBetween(userId, TransactionType.INCOME, start, end);
            BigDecimal expenses = transactionRepository.sumByUserAndTypeBetween(userId, TransactionType.EXPENSE, start, end);
            String label = ym.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH) + " " + ym.getYear();
            points.add(new MonthlyTrendPoint(label, income, expenses));
        }
        return points;
    }

    private List<CategoryBreakdownPoint> buildCategoryBreakdown(Long userId, LocalDate start, LocalDate end, BigDecimal totalExpenses) {
        Map<Long, Category> categories = categoryRepository.findAllVisibleToUser(userId).stream()
                .collect(Collectors.toMap(Category::getId, c -> c));

        List<TransactionRepository.CategoryTotalProjection> totals =
                transactionRepository.sumExpensesByCategoryBetween(userId, start, end);

        return totals.stream()
                .filter(p -> p.getCategoryId() != null)
                .map(p -> {
                    Category cat = categories.get(p.getCategoryId());
                    double pct = totalExpenses.compareTo(BigDecimal.ZERO) > 0
                            ? p.getTotal().divide(totalExpenses, 4, RoundingMode.HALF_UP).doubleValue() * 100
                            : 0;
                    return new CategoryBreakdownPoint(
                            p.getCategoryId(),
                            cat != null ? cat.getName() : "Uncategorized",
                            cat != null ? cat.getColor() : "#5A5A5A",
                            p.getTotal(),
                            Math.round(pct * 10) / 10.0
                    );
                })
                .sorted((a, b) -> b.total().compareTo(a.total()))
                .toList();
    }
}
