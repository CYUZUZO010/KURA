package com.budgettracker.scheduler;

import com.budgettracker.service.RecurringTransactionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

/**
 * Runs once a day (default 01:00 server time) and posts any recurring transactions
 * (rent, subscriptions, salary, etc.) whose next scheduled date has arrived.
 * Also runs once at application startup so demo data / missed days catch up immediately.
 */
@Component
public class RecurringTransactionScheduler {

    private static final Logger log = LoggerFactory.getLogger(RecurringTransactionScheduler.class);

    private final RecurringTransactionService recurringTransactionService;

    public RecurringTransactionScheduler(RecurringTransactionService recurringTransactionService) {
        this.recurringTransactionService = recurringTransactionService;
    }

    @Scheduled(cron = "0 0 1 * * *") // every day at 01:00
    public void runDailyRecurringJob() {
        log.info("Running scheduled recurring-transaction job");
        recurringTransactionService.processDueRecurringTransactions(LocalDate.now());
    }
}
