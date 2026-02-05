package io.github.thrddqno.ledgerly.wallet.dto;

public record WalletRequest(
		String name,
		double startingBalance,
		String currencyCode
		) {

}
