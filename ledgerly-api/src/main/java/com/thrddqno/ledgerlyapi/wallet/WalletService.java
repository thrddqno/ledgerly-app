package com.thrddqno.ledgerlyapi.wallet;

import com.thrddqno.ledgerlyapi.transaction.TransactionRepository;
import com.thrddqno.ledgerlyapi.user.User;
import com.thrddqno.ledgerlyapi.wallet.dto.WalletDetailsResponse;
import com.thrddqno.ledgerlyapi.wallet.dto.WalletRequest;
import com.thrddqno.ledgerlyapi.wallet.dto.WalletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository walletRepository;
    private final WalletMapper walletMapper;

    private static final int MAX_WALLETS_PER_USER = 10;
    private final TransactionRepository transactionRepository;

    //get wallet
    public WalletResponse getWalletBalance(User user, UUID walletId){
        //TODO: resourcenotfoundexception
        Wallet wallet = walletRepository.findByUserAndId(user, walletId).orElseThrow();
        return walletMapper.toWalletResponse(wallet);
    }

    //get wallets
    public List<WalletResponse> getAllWalletBalance(User user){
        List<Wallet> wallets = walletRepository.findByUser(user);
        return wallets.stream().map(walletMapper::toWalletResponse).toList();
    }

    //get wallet details
    public WalletDetailsResponse getWalletDetails(User user, UUID walletId){
        //TODO: resourcenotfoundexception
        Wallet wallet = walletRepository.findByUserAndId(user, walletId).orElseThrow();
        return walletMapper.toWalletDetailsResponse(wallet);
    }

    //get wallets details
    public List<WalletDetailsResponse> getAllWalletDetails(User user){
        List<Wallet> wallets = walletRepository.findByUser(user);
        return wallets.stream().map(walletMapper::toWalletDetailsResponse).toList();
    }

    //create wallet
    @Transactional
    public WalletDetailsResponse createWallet(User user, WalletRequest request){

        long walletCount = walletRepository.countByUser(user);
        if (walletCount >= MAX_WALLETS_PER_USER){
            throw new IllegalStateException("User cannot create more than 10 wallets");
        }
        Wallet wallet = Wallet.builder()
                .name(request.name())
                .startingBalance(request.startingBalance())
                .user(user)
                .build();

        walletRepository.saveAndFlush(wallet);

        return walletMapper.toWalletDetailsResponse(wallet);
    }

    public WalletDetailsResponse updateWallet(User user, UUID walletId, WalletRequest request){
        Wallet wallet = walletRepository.findByUserAndId(user, walletId).orElseThrow();

        wallet.setName(request.name());
        wallet.setStartingBalance(request.startingBalance());
        walletRepository.save(wallet);

        return walletMapper.toWalletDetailsResponse(wallet);
    }

    @Transactional
    public void deleteWallet(User user, UUID walletId){
        Wallet wallet = walletRepository.findByUserAndId(user, walletId).orElseThrow();
        transactionRepository.deleteAllByWallet(wallet);
        walletRepository.delete(wallet);
    }

}
