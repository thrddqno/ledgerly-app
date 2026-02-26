package com.thrddqno.ledgerlyapi.transaction.dto;

import com.thrddqno.ledgerlyapi.category.dto.CategoryResponse;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record TransactionResponse(
        UUID id,
        String notes,
        BigDecimal amount,
        CategoryResponse categoryResponse,
        LocalDate date,
        UUID walletId
) {
}
