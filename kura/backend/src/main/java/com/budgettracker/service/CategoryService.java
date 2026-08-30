package com.budgettracker.service;

import com.budgettracker.dto.CategoryRequest;
import com.budgettracker.dto.CategoryResponse;
import com.budgettracker.entity.Category;
import com.budgettracker.exception.BadRequestException;
import com.budgettracker.exception.ResourceNotFoundException;
import com.budgettracker.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryResponse> getAllForUser(Long userId) {
        return categoryRepository.findAllVisibleToUser(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public CategoryResponse create(Long userId, CategoryRequest request) {
        Category category = Category.builder()
                .userId(userId)
                .name(request.name().trim())
                .type(request.type())
                .color(request.color() != null ? request.color() : "#1A365D")
                .icon(request.icon())
                .isSystem(false)
                .build();

        category = categoryRepository.save(category);
        return toResponse(category);
    }

    @Transactional
    public void delete(Long userId, Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (category.isSystem()) {
            throw new BadRequestException("Default categories can't be deleted");
        }
        if (!category.getUserId().equals(userId)) {
            throw new BadRequestException("You don't have permission to delete this category");
        }
        categoryRepository.delete(category);
    }

    private CategoryResponse toResponse(Category c) {
        return new CategoryResponse(c.getId(), c.getName(), c.getType(), c.getColor(), c.getIcon(), c.isSystem());
    }
}
