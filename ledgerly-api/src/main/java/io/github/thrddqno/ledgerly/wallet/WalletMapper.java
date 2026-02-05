package io.github.thrddqno.ledgerly.wallet;

import org.mapstruct.Mapper;

import io.github.thrddqno.ledgerly.wallet.dto.WalletDTO;

@Mapper(componentModel = "spring")
public interface WalletMapper {
	WalletDTO toDTO(Wallet wallet);
}
