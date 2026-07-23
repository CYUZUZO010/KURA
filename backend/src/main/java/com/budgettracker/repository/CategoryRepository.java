package com.budgettracker.repository;

import com.budgettracker.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Query("SELECT c FROM Category c WHERE c.userId IS NULL OR c.userId = :userId ORDER BY c.isSystem DESC, c.name ASC")
    List<Category> findAllVisibleToUser(@Param("userId") Long userId);
}
