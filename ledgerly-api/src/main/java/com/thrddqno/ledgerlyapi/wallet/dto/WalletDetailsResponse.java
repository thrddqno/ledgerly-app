package com.thrddqno.ledgerlyapi.wallet.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record WalletDetailsResponse(
        UUID id,
        String name,
        BigDecimal startingBalance,
        BigDecimal cachedTransactions,
        LocalDateTime createdAt
) {
}
