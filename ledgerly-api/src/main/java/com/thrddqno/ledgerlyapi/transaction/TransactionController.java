package com.thrddqno.ledgerlyapi.transaction;

import com.thrddqno.ledgerlyapi.transaction.dto.PagedTransactionResponse;
import com.thrddqno.ledgerlyapi.transaction.dto.TransactionRequest;
import com.thrddqno.ledgerlyapi.transaction.dto.TransactionResponse;
import com.thrddqno.ledgerlyapi.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/{walletId}/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping("/{transactionId}")
    public ResponseEntity<TransactionResponse> getTransaction(
            @AuthenticationPrincipal User user,
            @PathVariable UUID walletId,
            @PathVariable UUID transactionId){
        return ResponseEntity.ok(transactionService.getTransaction(user,walletId,transactionId));
    }

    @GetMapping
    public ResponseEntity<PagedTransactionResponse<TransactionResponse>> getAllTransactions(
            @AuthenticationPrincipal User user,
            @PathVariable UUID walletId,
            @RequestParam int page,
            @RequestParam int size){
        return ResponseEntity.ok(transactionService.getAllTransactions(user,walletId,page,size));
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(
            @AuthenticationPrincipal User user,
            @PathVariable UUID walletId,
            @RequestBody TransactionRequest transactionRequest){
        return ResponseEntity.ok(transactionService.createTransaction(user,walletId,transactionRequest));
    }

    @PutMapping("/{transactionId}")
    public ResponseEntity<TransactionResponse> updateTransaction(
            @AuthenticationPrincipal User user,
            @PathVariable UUID walletId,
            @PathVariable UUID transactionId,
            @RequestBody TransactionRequest transactionRequest){
        return ResponseEntity.ok(transactionService.updateTransaction(user, walletId, transactionId, transactionRequest));
    }

    @DeleteMapping("/{transactionId}")
    public ResponseEntity<Void> deleteTransaction(
            @AuthenticationPrincipal User user,
            @PathVariable UUID walletId,
            @PathVariable UUID transactionId){
        transactionService.deleteTransaction(user,walletId,transactionId);
        return ResponseEntity.noContent().build();
    }


}
