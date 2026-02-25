package com.thrddqno.ledgerlyapi.transaction.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionRequest(
        //TODO: add category
        String notes,
        BigDecimal amount,
        LocalDate date
) {
}
