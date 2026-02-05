package io.github.thrddqno.ledgerly.transaction.dto;

import java.time.LocalDate;
import java.util.UUID;

public record TransferRequest(
		UUID sourceWallet,
		UUID destinationWallet,
		String note,
		double amount,
		LocalDate transactionDate
		) {
}
