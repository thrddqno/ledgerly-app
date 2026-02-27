package com.thrddqno.ledgerlyapi.transaction.dto;

import java.util.List;

public record CursorPagedTransactionResponse<T>(
        List<T> data,
        int pageSize,
        String nextCursor,
        boolean hasNext
) {
}
