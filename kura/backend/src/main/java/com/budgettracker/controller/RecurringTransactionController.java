package com.budgettracker.controller;

import com.budgettracker.dto.RecurringTransactionRequest;
import com.budgettracker.dto.RecurringTransactionResponse;
import com.budgettracker.security.AuthenticatedUser;
import com.budgettracker.service.RecurringTransactionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recurring-transactions")
public class RecurringTransactionController {

    private final RecurringTransactionService recurringTransactionService;

    public RecurringTransactionController(RecurringTransactionService recurringTransactionService) {
        this.recurringTransactionService = recurringTransactionService;
    }

    @GetMapping
    public ResponseEntity<List<RecurringTransactionResponse>> list(@AuthenticationPrincipal AuthenticatedUser user) {
        return ResponseEntity.ok(recurringTransactionService.list(user.userId()));
    }

    @PostMapping
    public ResponseEntity<RecurringTransactionResponse> create(
            @AuthenticationPrincipal AuthenticatedUser user,
            @Valid @RequestBody RecurringTransactionRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(recurringTransactionService.create(user.userId(), request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivate(@AuthenticationPrincipal AuthenticatedUser user, @PathVariable Long id) {
        recurringTransactionService.deactivate(user.userId(), id);
        return ResponseEntity.noContent().build();
    }
}
