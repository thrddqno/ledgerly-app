package com.thrddqno.ledgerlyapi.transaction.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
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
        UUID walletId,
        UUID transferId,
        UUID relatedTransactionId

) {
    @JsonProperty
    public boolean isTransfer() {
        return transferId != null;
    }

}
