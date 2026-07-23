package com.budgettracker.dto;

public record ImportResultResponse(
        Long batchId,
        String fileName,
        int rowsImported,
        int rowsSkipped
) {}
