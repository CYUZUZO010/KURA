package com.budgettracker.controller;

import com.budgettracker.dto.ImportResultResponse;
import com.budgettracker.security.AuthenticatedUser;
import com.budgettracker.service.CsvImportService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/import")
public class ImportController {

    private final CsvImportService csvImportService;

    public ImportController(CsvImportService csvImportService) {
        this.csvImportService = csvImportService;
    }

    @PostMapping(value = "/csv", consumes = "multipart/form-data")
    public ResponseEntity<ImportResultResponse> importCsv(
            @AuthenticationPrincipal AuthenticatedUser user,
            @RequestParam("file") MultipartFile file
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(csvImportService.importCsv(user.userId(), file));
    }
}
