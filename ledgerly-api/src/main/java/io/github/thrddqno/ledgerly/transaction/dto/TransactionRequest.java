package io.github.thrddqno.ledgerly.transaction.dto;

import io.github.thrddqno.ledgerly.category.Category;
import io.github.thrddqno.ledgerly.wallet.Wallet;

public record TransactionRequest(
		Category category,
		Wallet wallet,
		String note,
		double amount
		) {
}
