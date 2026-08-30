package com.budgettracker.security;

/** Lightweight principal stored in the SecurityContext for each authenticated request. */
public record AuthenticatedUser(Long userId, String email) {
}
