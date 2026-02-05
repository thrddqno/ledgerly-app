package io.github.thrddqno.ledgerly.wallet;

import java.util.List;
import java.util.UUID;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import io.github.thrddqno.ledgerly.common.security.SecurityUtils;
import io.github.thrddqno.ledgerly.user.User;
import io.github.thrddqno.ledgerly.wallet.dto.WalletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WalletService {
	
	private final WalletRepository walletRepository;
	private final WalletMapper walletMapper;

	//getallwallet
	public List<WalletRequest> getAllWallet() {
		User user = SecurityUtils.currentUser();
		List<Wallet> wallets = walletRepository.findByUser(user).orElseThrow();
		return wallets.stream().map(walletMapper::toDTO).toList();
	}
	
	//getwallet
	public WalletRequest getWalletByPublicId(UUID publicId) {
		Wallet wallet = getOwnedWallet(publicId);
		return new WalletRequest(wallet.getName(), wallet.getStartingBalance(), wallet.getCurrencyCode());
	}
	
	//create wallet
	public WalletRequest createWallet(WalletRequest walletDTO) {
		User user = SecurityUtils.currentUser();
		
		Wallet wallet = Wallet.builder()
				.name(walletDTO.name())
				.startingBalance(walletDTO.startingBalance())
				.currencyCode(walletDTO.currencyCode())
				.user(user)
				.build();
		walletRepository.save(wallet);
		return walletMapper.toDTO(wallet);
	}
	
	//update wallet
	public WalletRequest updateWallet(UUID publicId, WalletRequest walletDTO) {
		Wallet wallet = getOwnedWallet(publicId);
		
		wallet.setName(walletDTO.name());
		wallet.setStartingBalance(walletDTO.startingBalance());
		wallet.setCurrencyCode(walletDTO.currencyCode());
		walletRepository.save(wallet);
		
		return walletMapper.toDTO(wallet);
	}
	
	//delete wallet
	public void deleteWallet(UUID publicId) {
		Wallet wallet = getOwnedWallet(publicId);
		walletRepository.delete(wallet);
	}
	
	private Wallet getOwnedWallet(UUID publicId) {
	    User user = SecurityUtils.currentUser();
	    Wallet wallet = walletRepository.findByPublicId(publicId).orElseThrow();
	    if (!wallet.getUser().getId().equals(user.getId())) {
	        throw new AccessDeniedException("Forbidden");
	    }
	    return wallet;
	}


}
