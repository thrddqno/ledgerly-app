package com.thrddqno.ledgerlyapi.transaction;

import com.thrddqno.ledgerlyapi.transaction.dto.CursorPagedTransactionResponse;
import com.thrddqno.ledgerlyapi.transaction.dto.PagedTransactionResponse;
import com.thrddqno.ledgerlyapi.transaction.dto.TransactionResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.data.domain.Page;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;

@Mapper(componentModel = "spring")
public interface TransactionMapper {

    @Mapping(target = "walletId", source = "wallet.id")
    @Mapping(target = "categoryResponse", source = "category")
    @Mapping(target = "relatedTransactionId", expression = "java(transaction.getRelatedTransaction() != null ? transaction.getRelatedTransaction().getId() : null)")
    TransactionResponse toTransactionResponse(Transaction transaction);

    @Mapping(target = "data", source = "content")
    @Mapping(target = "page", expression = "java(page.getNumber() + 1)")
    @Mapping(target = "limit", source = "size")
    @Mapping(target = "total", source = "totalElements")
    PagedTransactionResponse<TransactionResponse> toPagedResponse(Page<Transaction> page);

    // Cursor-based pagination using iterable UUIDs
    default CursorPagedTransactionResponse<TransactionResponse> toCursorPagedTransactionResponse(
            List<Transaction> transactions,
            int limit
    ) {
        List<TransactionResponse> data = transactions.stream()
                .map(this::toTransactionResponse)
                .toList();

        boolean hasNext = transactions.size() == limit;

        String nextCursor = null;
        if (hasNext) {
            Transaction last = transactions.get(transactions.size() - 1);
            // encode date + id as cursor
            // TODO: find a much more reliable delimiter for cursors lol
            var rawCursor = last.getDate() + "|" + last.getId();
            nextCursor = Base64.getUrlEncoder().withoutPadding().encodeToString(rawCursor.getBytes(StandardCharsets.UTF_8));
        }

        return new CursorPagedTransactionResponse<>(data, limit, nextCursor, hasNext);
    }
}