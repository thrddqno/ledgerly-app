package com.thrddqno.ledgerlyapi.wallet.dto;

import java.math.BigDecimal;

public record WalletResponse(
        String name,
        BigDecimal balance
) {
}
