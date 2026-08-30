package com.budgettracker.service;

import com.budgettracker.dto.TransactionRequest;
import com.budgettracker.dto.TransactionResponse;
import com.budgettracker.entity.Category;
import com.budgettracker.entity.Transaction;
import com.budgettracker.entity.TransactionSource;
import com.budgettracker.exception.ResourceNotFoundException;
import com.budgettracker.repository.CategoryRepository;
import com.budgettracker.repository.TransactionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;

    public TransactionService(TransactionRepository transactionRepository, CategoryRepository categoryRepository) {
        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
    }

    public Page<TransactionResponse> list(Long userId, Long categoryId, LocalDate from, LocalDate to, Pageable pageable) {
        Page<Transaction> page;
        if (categoryId != null) {
            page = transactionRepository.findByUserIdAndCategoryIdOrderByTransactionDateDesc(userId, categoryId, pageable);
        } else if (from != null && to != null) {
            page = transactionRepository.findByUserIdAndTransactionDateBetweenOrderByTransactionDateDesc(userId, from, to, pageable);
        } else {
            page = transactionRepository.findByUserIdOrderByTransactionDateDesc(userId, pageable);
        }

        Map<Long, Category> categoryCache = categoryRepository.findAllVisibleToUser(userId).stream()
                .collect(java.util.stream.Collectors.toMap(Category::getId, c -> c));

        return page.map(t -> toResponse(t, categoryCache));
    }

    @Transactional
    public TransactionResponse create(Long userId, TransactionRequest request) {
        Transaction transaction = Transaction.builder()
                .userId(userId)
                .categoryId(request.categoryId())
                .amount(request.amount())
                .type(request.type())
                .description(request.description())
                .merchant(request.merchant())
                .transactionDate(request.transactionDate())
                .source(TransactionSource.MANUAL)
                .build();

        transaction = transactionRepository.save(transaction);
        return toResponse(transaction, categoryLookup(userId));
    }

    @Transactional
    public TransactionResponse update(Long userId, Long transactionId, TransactionRequest request) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .filter(t -> t.getUserId().equals(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        transaction.setCategoryId(request.categoryId());
        transaction.setAmount(request.amount());
        transaction.setType(request.type());
        transaction.setDescription(request.description());
        transaction.setMerchant(request.merchant());
        transaction.setTransactionDate(request.transactionDate());

        transaction = transactionRepository.save(transaction);
        return toResponse(transaction, categoryLookup(userId));
    }

    @Transactional
    public void delete(Long userId, Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .filter(t -> t.getUserId().equals(userId))
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        transactionRepository.delete(transaction);
    }

    private Map<Long, Category> categoryLookup(Long userId) {
        return categoryRepository.findAllVisibleToUser(userId).stream()
                .collect(java.util.stream.Collectors.toMap(Category::getId, c -> c));
    }

    private TransactionResponse toResponse(Transaction t, Map<Long, Category> categoryCache) {
        Category category = t.getCategoryId() != null ? categoryCache.get(t.getCategoryId()) : null;
        return new TransactionResponse(
                t.getId(),
                t.getAmount(),
                t.getType(),
                t.getCategoryId(),
                category != null ? category.getName() : "Uncategorized",
                category != null ? category.getColor() : "#5A5A5A",
                t.getDescription(),
                t.getMerchant(),
                t.getTransactionDate(),
                t.getSource()
        );
    }
}
