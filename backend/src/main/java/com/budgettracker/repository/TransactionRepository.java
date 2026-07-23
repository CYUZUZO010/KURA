package com.budgettracker.repository;

import com.budgettracker.entity.Transaction;
import com.budgettracker.entity.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    Page<Transaction> findByUserIdOrderByTransactionDateDesc(Long userId, Pageable pageable);

    List<Transaction> findByUserIdAndTransactionDateBetween(Long userId, LocalDate start, LocalDate end);

    Page<Transaction> findByUserIdAndCategoryIdOrderByTransactionDateDesc(Long userId, Long categoryId, Pageable pageable);

    Page<Transaction> findByUserIdAndTransactionDateBetweenOrderByTransactionDateDesc(
            Long userId, LocalDate start, LocalDate end, Pageable pageable);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
           "WHERE t.userId = :userId AND t.type = :type AND t.transactionDate BETWEEN :start AND :end")
    BigDecimal sumByUserAndTypeBetween(@Param("userId") Long userId,
                                        @Param("type") TransactionType type,
                                        @Param("start") LocalDate start,
                                        @Param("end") LocalDate end);

    @Query("SELECT t.categoryId as categoryId, COALESCE(SUM(t.amount), 0) as total FROM Transaction t " +
           "WHERE t.userId = :userId AND t.type = 'EXPENSE' AND t.transactionDate BETWEEN :start AND :end " +
           "GROUP BY t.categoryId")
    List<CategoryTotalProjection> sumExpensesByCategoryBetween(@Param("userId") Long userId,
                                                                @Param("start") LocalDate start,
                                                                @Param("end") LocalDate end);

    interface CategoryTotalProjection {
        Long getCategoryId();
        BigDecimal getTotal();
    }
}
