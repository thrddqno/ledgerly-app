package com.thrddqno.ledgerlyapi.transaction;

import com.thrddqno.ledgerlyapi.transaction.dto.PagedTransactionResponse;
import com.thrddqno.ledgerlyapi.transaction.dto.TransactionRequest;
import com.thrddqno.ledgerlyapi.transaction.dto.TransactionResponse;
import com.thrddqno.ledgerlyapi.transaction.dto.TransferRequest;
import com.thrddqno.ledgerlyapi.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping("/{walletId}/{transactionId}")
    public ResponseEntity<TransactionResponse> getTransaction(
            @AuthenticationPrincipal User user,
            @PathVariable UUID walletId,
            @PathVariable UUID transactionId){
        return ResponseEntity.ok(transactionService.getTransaction(user,walletId,transactionId));
    }

    @GetMapping("/{walletId}")
    public ResponseEntity<PagedTransactionResponse<TransactionResponse>> getAllTransactions(
            @AuthenticationPrincipal User user,
            @PathVariable UUID walletId,
            @RequestParam int page,
            @RequestParam int size){
        return ResponseEntity.ok(transactionService.getAllTransactions(user,walletId,page,size));
    }

    @PostMapping("/{walletId}")
    public ResponseEntity<TransactionResponse> createTransaction(
            @AuthenticationPrincipal User user,
            @PathVariable UUID walletId,
            @RequestBody TransactionRequest transactionRequest){
        return ResponseEntity.ok(transactionService.createTransaction(user,walletId,transactionRequest));
    }

    @PostMapping("/transfer")
    public ResponseEntity<List<TransactionResponse>> createTransfer(
            @AuthenticationPrincipal User user,
            @RequestBody TransferRequest request){
        return ResponseEntity.ok(transactionService.createTransfer(user, request));
    }

    @PutMapping("/{walletId}/{transactionId}")
    public ResponseEntity<TransactionResponse> updateTransaction(
            @AuthenticationPrincipal User user,
            @PathVariable UUID walletId,
            @PathVariable UUID transactionId,
            @RequestBody TransactionRequest transactionRequest){
        return ResponseEntity.ok(transactionService.updateTransaction(user, walletId, transactionId, transactionRequest));
    }

    @PutMapping("/transfer/{transferId}")
    public ResponseEntity<List<TransactionResponse>> updateTransfer(
            @AuthenticationPrincipal User user,
            @PathVariable UUID transferId,
            @RequestBody TransferRequest request){
        return ResponseEntity.ok(transactionService.updateTransfer(user, transferId, request));
    }

    @DeleteMapping("/{walletId}/{transactionId}")
    public ResponseEntity<Void> deleteTransaction(
            @AuthenticationPrincipal User user,
            @PathVariable UUID walletId,
            @PathVariable UUID transactionId){
        transactionService.deleteTransaction(user,walletId,transactionId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/transfer/{transferId}")
    public ResponseEntity<Void> deleteTransfer(
            @AuthenticationPrincipal User user,
            @PathVariable UUID transferId){
        transactionService.deleteTransfer(user, transferId);
        return ResponseEntity.noContent().build();
    }
}
