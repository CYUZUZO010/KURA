package com.budgettracker.dto;

import com.budgettracker.entity.TransactionSource;
import com.budgettracker.entity.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionResponse(
        Long id,
        BigDecimal amount,
        TransactionType type,
        Long categoryId,
        String categoryName,
        String categoryColor,
        String description,
        String merchant,
        LocalDate transactionDate,
        TransactionSource source
) {}
