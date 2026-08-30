package com.budgettracker;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class BudgetTrackerApplicationTests {

    @Test
    void contextLoads() {
        // Verifies the Spring application context starts successfully with an in-memory H2 database.
    }
}
