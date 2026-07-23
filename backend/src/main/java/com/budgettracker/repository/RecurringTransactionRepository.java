package com.budgettracker.repository;

import com.budgettracker.entity.RecurringTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface RecurringTransactionRepository extends JpaRepository<RecurringTransaction, Long> {
    List<RecurringTransaction> findByUserIdOrderByNextRunDateAsc(Long userId);
    List<RecurringTransaction> findByIsActiveTrueAndNextRunDateLessThanEqual(LocalDate date);
}
