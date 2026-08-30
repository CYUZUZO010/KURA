package com.budgettracker.service;

import com.budgettracker.dto.ImportResultResponse;
import com.budgettracker.entity.ImportBatch;
import com.budgettracker.entity.Transaction;
import com.budgettracker.entity.TransactionSource;
import com.budgettracker.entity.TransactionType;
import com.budgettracker.exception.BadRequestException;
import com.budgettracker.repository.ImportBatchRepository;
import com.budgettracker.repository.TransactionRepository;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

/**
 * Imports bank / card statement CSV exports.
 * Expected flexible columns (case-insensitive, order-independent):
 * date, description, amount, category (optional), merchant (optional)
 * A negative amount is treated as an expense, positive as income, unless a
 * "type" column explicitly says INCOME/EXPENSE.
 */
@Service
public class CsvImportService {

    private static final List<DateTimeFormatter> DATE_FORMATS = List.of(
            DateTimeFormatter.ofPattern("yyyy-MM-dd"),
            DateTimeFormatter.ofPattern("MM/dd/yyyy"),
            DateTimeFormatter.ofPattern("dd/MM/yyyy"),
            DateTimeFormatter.ofPattern("M/d/yyyy"));

    private final TransactionRepository transactionRepository;
    private final ImportBatchRepository importBatchRepository;

    public CsvImportService(TransactionRepository transactionRepository, ImportBatchRepository importBatchRepository) {
        this.transactionRepository = transactionRepository;
        this.importBatchRepository = importBatchRepository;
    }

    @Transactional
    public ImportResultResponse importCsv(Long userId, MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("The uploaded file is empty");
        }

        int imported = 0;
        int skipped = 0;

        try (Reader reader = new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8);
                CSVReader csvReader = new CSVReader(reader)) {

            List<String[]> rows = csvReader.readAll();
            if (rows.isEmpty()) {
                throw new BadRequestException("CSV file has no rows");
            }

            String[] header = rows.get(0);
            int dateIdx = findColumn(header, "date");
            int descIdx = findColumn(header, "description", "memo", "details");
            int amountIdx = findColumn(header, "amount");
            int merchantIdx = findColumn(header, "merchant", "payee");

            if (dateIdx == -1 || amountIdx == -1) {
                throw new BadRequestException("CSV must contain at least 'date' and 'amount' columns");
            }

            List<Transaction> toSave = new ArrayList<>();

            for (int i = 1; i < rows.size(); i++) {
                String[] row = rows.get(i);
                try {
                    LocalDate date = parseDate(row[dateIdx].trim());
                    BigDecimal rawAmount = new BigDecimal(row[amountIdx].trim().replace(",", ""));
                    TransactionType type = rawAmount.signum() < 0 ? TransactionType.EXPENSE : TransactionType.INCOME;
                    BigDecimal amount = rawAmount.abs();

                    String description = descIdx != -1 && descIdx < row.length ? row[descIdx].trim() : null;
                    String merchant = merchantIdx != -1 && merchantIdx < row.length ? row[merchantIdx].trim() : null;

                    Transaction transaction = Transaction.builder()
                            .userId(userId)
                            .amount(amount)
                            .type(type)
                            .description(description)
                            .merchant(merchant)
                            .transactionDate(date)
                            .source(TransactionSource.CSV_IMPORT)
                            .build();

                    toSave.add(transaction);
                    imported++;
                } catch (Exception rowError) {
                    skipped++;
                }
            }

            transactionRepository.saveAll(toSave);

        } catch (IOException | CsvException e) {

            throw new BadRequestException("Could not read the CSV file: " + e.getMessage());
        }

        ImportBatch batch = ImportBatch.builder()
                .userId(userId)
                .fileName(file.getOriginalFilename())
                .rowsImported(imported)
                .rowsSkipped(skipped)
                .status("COMPLETED")
                .build();
        batch = importBatchRepository.save(batch);

        return new ImportResultResponse(batch.getId(), batch.getFileName(), imported, skipped);
    }

    private int findColumn(String[] header, String... candidates) {
        for (int i = 0; i < header.length; i++) {
            String col = header[i].trim().toLowerCase();
            for (String candidate : candidates) {
                if (col.equals(candidate))
                    return i;
            }
        }
        return -1;
    }

    private LocalDate parseDate(String value) {
        for (DateTimeFormatter fmt : DATE_FORMATS) {
            try {
                return LocalDate.parse(value, fmt);
            } catch (DateTimeParseException ignored) {
                // try next format
            }
        }
        throw new IllegalArgumentException("Unrecognized date format: " + value);
    }
}
