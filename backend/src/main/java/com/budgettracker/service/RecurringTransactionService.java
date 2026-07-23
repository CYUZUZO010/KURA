package com.budgettracker.service;

import com.budgettracker.dto.RecurringTransactionRequest;
import com.budgettracker.dto.RecurringTransactionResponse;
import com.budgettracker.entity.*;
import com.budgettracker.exception.ResourceNotFoundException;
import com.budgettracker.repository.CategoryRepository;
import com.budgettracker.repository.RecurringTransactionRepository;
import com.budgettracker.repository.TransactionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RecurringTransactionService {

    private static final Logger log = LoggerFactory.getLogger(RecurringTransactionService.class);

    private final RecurringTransactionRepository recurringRepository;
    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;

    public RecurringTransactionService(RecurringTransactionRepository recurringRepository,
                                        TransactionRepository transactionRepository,
                                        CategoryRepository categoryRepository) {
        this.recurringRepository = recurringRepository;
        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public RecurringTransactionResponse create(Long userId, RecurringTransactionRequest request) {
        RecurringTransaction recurring = RecurringTransaction.builder()
                .userId(userId)
                .categoryId(request.categoryId())
                .amount(request.amount())
                .type(request.type())
                .description(request.description())
                .frequency(request.frequency())
                .startDate(request.startDate())
                .endDate(request.endDate())
                .nextRunDate(request.startDate())
                .isActive(true)
                .build();

        recurring = recurringRepository.save(recurring);
        return toResponse(recurring, categoryLookup(userId));
    }

    public List<RecurringTransactionResponse> list(Long userId) {
        Map<Long, Category> categories = categoryLookup(userId);
        return recurringRepository.findByUserIdOrderByNextRunDateAsc(userId).stream()
                .map(r -> toResponse(r, categories))
                .toList();
    }

    @Transactional
    public void deactivate(Long userId, Long recurringId) {
        RecurringTransaction recurring = recurringRepository.findById(recurringId)
                .filter(r -> r.getUserId().equals(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Recurring transaction not found"));
        recurring.setActive(false);
        recurringRepository.save(recurring);
    }

    /**
     * Runs due recurring transactions: for every active template whose nextRunDate has arrived,
     * post a real transaction and advance the schedule. Called by the scheduled job.
     */
    @Transactional
    public int processDueRecurringTransactions(LocalDate asOf) {
        List<RecurringTransaction> due = recurringRepository.findByIsActiveTrueAndNextRunDateLessThanEqual(asOf);
        int processed = 0;

        for (RecurringTransaction recurring : due) {
            // Catch up on any missed runs (e.g. server was down) without generating an unbounded loop
            int safetyLimit = 500;
            while (!recurring.getNextRunDate().isAfter(asOf) && safetyLimit-- > 0) {
                if (recurring.getEndDate() != null && recurring.getNextRunDate().isAfter(recurring.getEndDate())) {
                    recurring.setActive(false);
                    break;
                }

                Transaction transaction = Transaction.builder()
                        .userId(recurring.getUserId())
                        .categoryId(recurring.getCategoryId())
                        .amount(recurring.getAmount())
                        .type(recurring.getType())
                        .description(recurring.getDescription())
                        .transactionDate(recurring.getNextRunDate())
                        .source(TransactionSource.RECURRING)
                        .recurringTransactionId(recurring.getId())
                        .build();

                transactionRepository.save(transaction);
                processed++;

                recurring.setNextRunDate(recurring.getFrequency().next(recurring.getNextRunDate()));
            }
            recurringRepository.save(recurring);
        }

        if (processed > 0) {
            log.info("Recurring transaction job posted {} transactions as of {}", processed, asOf);
        }
        return processed;
    }

    private Map<Long, Category> categoryLookup(Long userId) {
        return categoryRepository.findAllVisibleToUser(userId).stream()
                .collect(Collectors.toMap(Category::getId, c -> c));
    }

    private RecurringTransactionResponse toResponse(RecurringTransaction r, Map<Long, Category> categories) {
        Category category = r.getCategoryId() != null ? categories.get(r.getCategoryId()) : null;
        return new RecurringTransactionResponse(
                r.getId(), r.getAmount(), r.getType(), r.getCategoryId(),
                category != null ? category.getName() : "Uncategorized",
                r.getDescription(), r.getFrequency(), r.getStartDate(), r.getEndDate(),
                r.getNextRunDate(), r.isActive()
        );
    }
}
