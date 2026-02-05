package io.github.thrddqno.ledgerly.wallet;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.github.thrddqno.ledgerly.wallet.dto.WalletDTO;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {
	private final WalletService walletService;
	
	@GetMapping
	public ResponseEntity<List<WalletDTO>> getAllWallet(){
		return ResponseEntity.ok(walletService.getAllWallet());
	}
	
	@GetMapping("/{publicId}")
	public ResponseEntity<WalletDTO> getWallet(@PathVariable UUID publicId){
		return ResponseEntity.ok(walletService.getWalletByPublicId(publicId));
	}
	
	@PostMapping("/create")
	public ResponseEntity<WalletDTO> createWallet(@RequestBody WalletDTO walletDTO){
		return ResponseEntity.ok(walletService.createWallet(walletDTO));
	}
	
	@DeleteMapping("/delete/{publicId}")
	public ResponseEntity<String> deleteWallet(@PathVariable UUID publicId){
		walletService.deleteWallet(publicId);
		return ResponseEntity.ok("Wallet "+ publicId + " has been deleted");
	}
	
	@PutMapping("/edit/{publicId}")
	public ResponseEntity<WalletDTO> updateWallet(@PathVariable UUID publicId, @RequestBody WalletDTO walletDTO){
		return ResponseEntity.ok(walletService.updateWallet(publicId, walletDTO));
	}
	
}
