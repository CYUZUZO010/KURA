package com.budgettracker.service;

import com.budgettracker.dto.BudgetRequest;
import com.budgettracker.dto.BudgetResponse;
import com.budgettracker.entity.Budget;
import com.budgettracker.entity.Category;
import com.budgettracker.entity.TransactionType;
import com.budgettracker.exception.ResourceNotFoundException;
import com.budgettracker.repository.BudgetRepository;
import com.budgettracker.repository.CategoryRepository;
import com.budgettracker.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;

    public BudgetService(BudgetRepository budgetRepository,
                          CategoryRepository categoryRepository,
                          TransactionRepository transactionRepository) {
        this.budgetRepository = budgetRepository;
        this.categoryRepository = categoryRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public BudgetResponse create(Long userId, BudgetRequest request) {
        Budget existing = budgetRepository
                .findByUserIdAndCategoryIdAndPeriodMonthAndPeriodYear(
                        userId, request.categoryId(), request.periodMonth(), request.periodYear())
                .orElse(null);

        Budget budget = existing != null ? existing : Budget.builder()
                .userId(userId)
                .categoryId(request.categoryId())
                .periodMonth(request.periodMonth())
                .periodYear(request.periodYear())
                .build();

        budget.setMonthlyLimit(request.monthlyLimit());
        budget = budgetRepository.save(budget);

        return toResponseWithSpend(budget, categoryLookup(userId));
    }

    public List<BudgetResponse> getForPeriod(Long userId, int month, int year) {
        Map<Long, Category> categories = categoryLookup(userId);
        return budgetRepository.findByUserIdAndPeriodMonthAndPeriodYear(userId, month, year).stream()
                .map(b -> toResponseWithSpend(b, categories))
                .toList();
    }

    @Transactional
    public void delete(Long userId, Long budgetId) {
        Budget budget = budgetRepository.findById(budgetId)
                .filter(b -> b.getUserId().equals(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));
        budgetRepository.delete(budget);
    }

    private Map<Long, Category> categoryLookup(Long userId) {
        return categoryRepository.findAllVisibleToUser(userId).stream()
                .collect(Collectors.toMap(Category::getId, c -> c));
    }

    private BudgetResponse toResponseWithSpend(Budget budget, Map<Long, Category> categories) {
        YearMonth ym = YearMonth.of(budget.getPeriodYear(), budget.getPeriodMonth());
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        BigDecimal spent = transactionRepository.findByUserIdAndTransactionDateBetween(budget.getUserId(), start, end)
                .stream()
                .filter(t -> t.getType() == TransactionType.EXPENSE)
                .filter(t -> budget.getCategoryId().equals(t.getCategoryId()))
                .map(t -> t.getAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal remaining = budget.getMonthlyLimit().subtract(spent);
        double percentUsed = budget.getMonthlyLimit().compareTo(BigDecimal.ZERO) > 0
                ? spent.divide(budget.getMonthlyLimit(), 4, RoundingMode.HALF_UP).doubleValue() * 100
                : 0;

        Category category = categories.get(budget.getCategoryId());

        return new BudgetResponse(
                budget.getId(),
                budget.getCategoryId(),
                category != null ? category.getName() : "Unknown",
                category != null ? category.getColor() : "#5A5A5A",
                budget.getMonthlyLimit(),
                spent,
                remaining,
                Math.round(percentUsed * 10) / 10.0,
                budget.getPeriodMonth(),
                budget.getPeriodYear()
        );
    }
}
