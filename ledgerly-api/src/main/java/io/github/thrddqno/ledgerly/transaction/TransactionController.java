package io.github.thrddqno.ledgerly.transaction;

import java.util.List;
import java.util.UUID;

import org.apache.coyote.BadRequestException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.github.thrddqno.ledgerly.transaction.dto.TransactionRequest;
import io.github.thrddqno.ledgerly.transaction.dto.TransferRequest;
import io.github.thrddqno.ledgerly.user.User;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TransactionController {
	
	private final TransactionService transactionService;
	
	
	/**
	 * GET (TRANSACTION + TRANSFER)
	 */
	
	@GetMapping("/wallet/{walletId}/transactions")
	public ResponseEntity<List<TransactionRequest>> getTransactions(@AuthenticationPrincipal User user, @PathVariable UUID walletId){
		return ResponseEntity.ok(transactionService.getTransactionsByWallet(user, walletId));
	}
	
	@GetMapping("/wallet/{walletId}/transactions/{transactionId}")
	public ResponseEntity<TransactionRequest> getTransaction(@AuthenticationPrincipal User user,
			@PathVariable UUID walletId,
			@PathVariable UUID transactionId){
		return ResponseEntity.ok(transactionService.getTransaction(user, walletId, transactionId));
	}
	
	//TRANSACTION
	/**
	 * POST
	 */
	
	@PostMapping("/wallet/{walletId}/transactions")
	public ResponseEntity<TransactionRequest> createTransaction(@AuthenticationPrincipal User user,
			@PathVariable UUID walletId,
			@RequestBody TransactionRequest request){
		return ResponseEntity.ok(transactionService.createTransaction(user, walletId, request));
	}
	
	
	/**
	 * PUT
	 */
	@PutMapping("/wallet/{walletId}/transactions/{transactionId}")
	public ResponseEntity<TransactionRequest> updateTransaction(@AuthenticationPrincipal User user,
			@PathVariable UUID walletId,
			@PathVariable UUID transactionId,
			@RequestBody TransactionRequest request){
		return ResponseEntity.ok(transactionService.updateTransaction(user, walletId, transactionId, request));
	}
	
	
	/**
	 * DELETE
	 */
	
	@DeleteMapping("/wallet/{walletId}/transactions/{transactionId}")
	public ResponseEntity<Void> deleteTransaction(@AuthenticationPrincipal User user,
			@PathVariable UUID walletId,
			@PathVariable UUID transactionId){
		
		transactionService.deleteTransaction(user, walletId, transactionId);
		return ResponseEntity.noContent().build();
	}
	
	//TRANSFER
	/**
	 * POST
	 */
	
	@PostMapping("/wallet/{walletId}/transactions/transfer")
	public ResponseEntity<List<TransactionRequest>> createTransfer(@AuthenticationPrincipal User user,
			@PathVariable UUID walletId,
			@RequestBody TransferRequest request) throws BadRequestException {
		
		if (!walletId.equals(request.sourceWallet())) {
			throw new BadRequestException("Path wallet ID must match the source wallet in request");
		}
		
		return ResponseEntity.ok(transactionService.createTransfer(user, request));
	}
	
	/**
	 * PUT
	 */
	
	// Update transfer pair via the shared transferId
		@PutMapping("/wallet/{walletId}/transactions/transfer/{transferId}")
		public ResponseEntity<List<TransactionRequest>> updateTransfer(@AuthenticationPrincipal User user,
				@PathVariable UUID transferId,
				@PathVariable UUID walletId,
				@RequestBody TransferRequest request) throws BadRequestException {
			
			return ResponseEntity.ok(transactionService.updateTransfer(user, transferId, request));
		}
	
	/**
	 * DELETE
	 */
		@DeleteMapping("/transactions/transfer/{transferId}")
		public ResponseEntity<Void> deleteTransfer(@AuthenticationPrincipal User user,
				@PathVariable UUID transferId) {
			
			transactionService.deleteTransfer(user, transferId);
			return ResponseEntity.noContent().build();
		}

}
