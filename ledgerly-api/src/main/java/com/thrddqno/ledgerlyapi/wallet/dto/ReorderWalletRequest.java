package com.thrddqno.ledgerlyapi.wallet.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.UUID;

public record ReorderWalletRequest(
        @NotNull
        @Size(min = 1)
        List<UUID> walletIds
) {
}
