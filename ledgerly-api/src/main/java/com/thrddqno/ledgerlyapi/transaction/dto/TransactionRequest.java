package com.thrddqno.ledgerlyapi.transaction.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record TransactionRequest(
        UUID categoryId,
        String notes,
        BigDecimal amount,
        LocalDate date
) {
}
