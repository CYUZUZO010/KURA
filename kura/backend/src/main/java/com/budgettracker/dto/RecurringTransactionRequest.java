package com.budgettracker.dto;

import com.budgettracker.entity.RecurrenceFrequency;
import com.budgettracker.entity.TransactionType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

public record RecurringTransactionRequest(
        @NotNull @Positive BigDecimal amount,
        @NotNull TransactionType type,
        Long categoryId,
        String description,
        @NotNull RecurrenceFrequency frequency,
        @NotNull LocalDate startDate,
        LocalDate endDate
) {}
