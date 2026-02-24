package com.thrddqno.ledgerlyapi.wallet;

import com.thrddqno.ledgerlyapi.user.User;
import com.thrddqno.ledgerlyapi.wallet.dto.WalletDetailsResponse;
import com.thrddqno.ledgerlyapi.wallet.dto.WalletRequest;
import com.thrddqno.ledgerlyapi.wallet.dto.WalletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    //get wallet
    @GetMapping("/{id}")
    public ResponseEntity<WalletResponse> getWalletBalance(@AuthenticationPrincipal User user, @PathVariable UUID id){
        return ResponseEntity.ok(walletService.getWalletBalance(user, id));
    }

    //get all wallet
    @GetMapping()
    public ResponseEntity<List<WalletResponse>> getAllWalletBalance(@AuthenticationPrincipal User user){
        return ResponseEntity.ok(walletService.getAllWalletBalance(user));
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<WalletDetailsResponse> getWalletDetails(@AuthenticationPrincipal User user, @PathVariable UUID id){
        return ResponseEntity.ok(walletService.getWalletDetails(user, id));
    }

    @GetMapping("/details")
    public ResponseEntity<List<WalletDetailsResponse>> getAllWalletDetails(@AuthenticationPrincipal User user){
        return ResponseEntity.ok(walletService.getAllWalletDetails(user));
    }

    @PostMapping
    public ResponseEntity<WalletDetailsResponse> createWallet(@AuthenticationPrincipal User user, @RequestBody WalletRequest request){
        return ResponseEntity.ok(walletService.createWallet(user, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WalletDetailsResponse> updateWallet(@AuthenticationPrincipal User user, @PathVariable UUID id, @RequestBody WalletRequest request){
        return ResponseEntity.ok(walletService.updateWallet(user,id,request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWallet(@AuthenticationPrincipal User user, @PathVariable UUID id){
        walletService.deleteWallet(user,id);
        return ResponseEntity.noContent().build();
    }

}
