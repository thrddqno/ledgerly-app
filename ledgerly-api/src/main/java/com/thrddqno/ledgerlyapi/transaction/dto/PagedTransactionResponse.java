package com.thrddqno.ledgerlyapi.transaction.dto;

import java.util.List;

public record PagedTransactionResponse<T>(
        List<T> data,
        int page,
        int limit,
        int total
) {
}
