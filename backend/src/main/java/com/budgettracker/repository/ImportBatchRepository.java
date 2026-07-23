package com.budgettracker.repository;

import com.budgettracker.entity.ImportBatch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImportBatchRepository extends JpaRepository<ImportBatch, Long> {
    List<ImportBatch> findByUserIdOrderByCreatedAtDesc(Long userId);
}
