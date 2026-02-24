package com.thrddqno.ledgerlyapi.wallet.dto;

import java.math.BigDecimal;

public record WalletRequest(
        String name,
        BigDecimal startingBalance
) {
}
