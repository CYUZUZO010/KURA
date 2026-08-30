package com.budgettracker.entity;

import java.time.LocalDate;

public enum RecurrenceFrequency {
    DAILY {
        public LocalDate next(LocalDate from) { return from.plusDays(1); }
    },
    WEEKLY {
        public LocalDate next(LocalDate from) { return from.plusWeeks(1); }
    },
    BIWEEKLY {
        public LocalDate next(LocalDate from) { return from.plusWeeks(2); }
    },
    MONTHLY {
        public LocalDate next(LocalDate from) { return from.plusMonths(1); }
    },
    YEARLY {
        public LocalDate next(LocalDate from) { return from.plusYears(1); }
    };

    public abstract LocalDate next(LocalDate from);
}
