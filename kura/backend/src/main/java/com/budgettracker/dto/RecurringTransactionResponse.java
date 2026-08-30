package com.budgettracker.dto;

import com.budgettracker.entity.RecurrenceFrequency;
import com.budgettracker.entity.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record RecurringTransactionResponse(
        Long id,
        BigDecimal amount,
        TransactionType type,
        Long categoryId,
        String categoryName,
        String description,
        RecurrenceFrequency frequency,
        LocalDate startDate,
        LocalDate endDate,
        LocalDate nextRunDate,
        boolean isActive
) {}
