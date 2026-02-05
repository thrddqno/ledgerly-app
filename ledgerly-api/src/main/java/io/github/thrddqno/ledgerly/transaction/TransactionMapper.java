package io.github.thrddqno.ledgerly.transaction;

import org.mapstruct.Mapper;

import io.github.thrddqno.ledgerly.transaction.dto.TransactionRequest;

@Mapper(componentModel = "spring")
public interface TransactionMapper {
	TransactionRequest toDTO(Transaction transaction);
}
