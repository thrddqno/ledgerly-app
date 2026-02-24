package com.thrddqno.ledgerlyapi.wallet;

import com.thrddqno.ledgerlyapi.wallet.dto.WalletDetailsResponse;
import com.thrddqno.ledgerlyapi.wallet.dto.WalletResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface WalletMapper{

    @Mapping(target = "balance", expression = "java(wallet.getCurrentBalance())")
    WalletResponse toWalletResponse(Wallet wallet);


    WalletDetailsResponse toWalletDetailsResponse(Wallet wallet);

}
