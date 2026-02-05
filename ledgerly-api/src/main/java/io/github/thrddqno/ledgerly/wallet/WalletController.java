package io.github.thrddqno.ledgerly.wallet;

import java.util.List;
import java.util.UUID;

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

import io.github.thrddqno.ledgerly.user.User;
import io.github.thrddqno.ledgerly.wallet.dto.WalletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {
	private final WalletService walletService;
	
	@GetMapping
	public ResponseEntity<List<WalletRequest>> getAllWallet(@AuthenticationPrincipal User user){
		return ResponseEntity.ok(walletService.getAllWallet(user));
	}
	
	@GetMapping("/{publicId}")
	public ResponseEntity<WalletRequest> getWallet(@AuthenticationPrincipal User user, @PathVariable UUID publicId){
		return ResponseEntity.ok(walletService.getWalletByPublicId(user, publicId));
	}
	
	@PostMapping("/create")
	public ResponseEntity<WalletRequest> createWallet(@AuthenticationPrincipal User user, @RequestBody WalletRequest walletDTO){
		return ResponseEntity.ok(walletService.createWallet(user, walletDTO));
	}
	
	@DeleteMapping("/delete/{publicId}")
	public ResponseEntity<String> deleteWallet(@AuthenticationPrincipal User user, @PathVariable UUID publicId){
		walletService.deleteWallet(user, publicId);
		return ResponseEntity.ok("Wallet "+ publicId + " has been deleted");
	}
	
	@PutMapping("/edit/{publicId}")
	public ResponseEntity<WalletRequest> updateWallet(@AuthenticationPrincipal User user, @PathVariable UUID publicId, @RequestBody WalletRequest walletDTO){
		return ResponseEntity.ok(walletService.updateWallet(user, publicId, walletDTO));
	}
	
}
