package com.budgettracker.dto;

import com.budgettracker.entity.TransactionType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionRequest(
        @NotNull @Positive BigDecimal amount,
        @NotNull TransactionType type,
        Long categoryId,
        String description,
        String merchant,
        @NotNull LocalDate transactionDate
) {}
