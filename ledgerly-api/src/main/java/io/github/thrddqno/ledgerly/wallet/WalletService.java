package io.github.thrddqno.ledgerly.wallet;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import io.github.thrddqno.ledgerly.user.User;
import io.github.thrddqno.ledgerly.wallet.dto.WalletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WalletService {
	
	private final WalletRepository walletRepository;
	private final WalletMapper walletMapper;

	//getallwallet
	public List<WalletRequest> getAllWallet(User user) {
		List<Wallet> wallets = walletRepository.findByUser(user).orElseThrow();
		return wallets.stream().map(walletMapper::toDTO).toList();
	}
	
	//getwallet
	public WalletRequest getWalletByPublicId(User user, UUID publicId) {
		Wallet wallet = walletRepository.findByUserAndPublicId(user, publicId).orElseThrow();
		return new WalletRequest(wallet.getName(), wallet.getStartingBalance(), wallet.getCurrencyCode());
	}
	
	//create wallet
	public WalletRequest createWallet(User user, WalletRequest walletDTO) {
		
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
	public WalletRequest updateWallet(User user, UUID publicId, WalletRequest walletDTO) {
		Wallet wallet = walletRepository.findByUserAndPublicId(user, publicId).orElseThrow();
		
		wallet.setName(walletDTO.name());
		wallet.setStartingBalance(walletDTO.startingBalance());
		wallet.setCurrencyCode(walletDTO.currencyCode());
		walletRepository.save(wallet);
		
		return walletMapper.toDTO(wallet);
	}
	
	//delete wallet
	public void deleteWallet(User user, UUID publicId) {
		Wallet wallet = walletRepository.findByUserAndPublicId(user, publicId).orElseThrow();
		walletRepository.delete(wallet);
	}


}
