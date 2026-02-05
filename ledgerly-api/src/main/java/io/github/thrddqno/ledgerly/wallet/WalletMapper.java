package io.github.thrddqno.ledgerly.wallet;

import org.mapstruct.Mapper;

import io.github.thrddqno.ledgerly.wallet.dto.WalletRequest;

@Mapper(componentModel = "spring")
public interface WalletMapper {
	WalletRequest toDTO(Wallet wallet);
}
