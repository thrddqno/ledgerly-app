package com.thrddqno.ledgerlyapi.wallet.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record WalletDetailsResponse(
        UUID id,
        String name,
        String startingBalance,
        String cachedTransactions,
        LocalDateTime createdAt
) {
}
