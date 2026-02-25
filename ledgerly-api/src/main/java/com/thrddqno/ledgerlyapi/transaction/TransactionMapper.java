package com.thrddqno.ledgerlyapi.transaction;

import com.thrddqno.ledgerlyapi.transaction.dto.PagedTransactionResponse;
import com.thrddqno.ledgerlyapi.transaction.dto.TransactionResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.data.domain.Page;

@Mapper(componentModel = "spring")
public interface TransactionMapper {

    TransactionResponse toTransactionResponse(Transaction transaction);

    @Mapping(target = "data", source = "content")
    @Mapping(target = "page", expression = "java(page.getNumber() + 1)")
    @Mapping(target = "limit", source = "size")
    @Mapping(target = "total", source = "totalElements")
    PagedTransactionResponse<TransactionResponse> toPagedResponse(Page<Transaction> page);

}