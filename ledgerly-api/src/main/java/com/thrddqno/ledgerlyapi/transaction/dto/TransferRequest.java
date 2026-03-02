package com.thrddqno.ledgerlyapi.transaction.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record TransferRequest(
        UUID sourceWalletId,
        UUID targetWalletId,
        String notes,
        BigDecimal amount,
        LocalDate date
) {
}
