package com.thrddqno.ledgerlyapi.wallet;

import com.thrddqno.ledgerlyapi.common.exception.BusinessValidationException;
import com.thrddqno.ledgerlyapi.common.exception.ResourceNotFoundException;
import com.thrddqno.ledgerlyapi.transaction.TransactionRepository;
import com.thrddqno.ledgerlyapi.user.User;
import com.thrddqno.ledgerlyapi.wallet.dto.ReorderWalletRequest;
import com.thrddqno.ledgerlyapi.wallet.dto.WalletDetailsResponse;
import com.thrddqno.ledgerlyapi.wallet.dto.WalletRequest;
import com.thrddqno.ledgerlyapi.wallet.dto.WalletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WalletService {

    private static final int MAX_WALLETS_PER_USER = 10;
    private final WalletRepository walletRepository;
    private final WalletMapper walletMapper;
    private final TransactionRepository transactionRepository;

    public WalletResponse getWalletBalance(User user, UUID walletId) {
        Wallet wallet = walletRepository.findByUserAndId(user, walletId).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Wallet could not be found",
                        "RESOURCE_NOT_FOUND",
                        HttpStatus.NOT_FOUND)
        );
        return walletMapper.toWalletResponse(wallet);
    }

    public List<WalletResponse> getAllWalletBalance(User user) {
        List<Wallet> wallets = walletRepository.findByUserOrderBySortOrderAsc(user);
        return wallets.stream().map(walletMapper::toWalletResponse).toList();
    }

    public WalletDetailsResponse getWalletDetails(User user, UUID walletId) {
        Wallet wallet = walletRepository.findByUserAndId(user, walletId).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Wallet could not be found",
                        "RESOURCE_NOT_FOUND",
                        HttpStatus.NOT_FOUND)
        );
        return walletMapper.toWalletDetailsResponse(wallet);
    }

    public List<WalletDetailsResponse> getAllWalletDetails(User user) {
        List<Wallet> wallets = walletRepository.findByUserOrderBySortOrderAsc(user);
        return wallets.stream().map(walletMapper::toWalletDetailsResponse).toList();
    }

    @Transactional
    public WalletDetailsResponse createWallet(User user, WalletRequest request) {

        long walletCount = walletRepository.countByUser(user);
        if (walletCount >= MAX_WALLETS_PER_USER) {
            throw new BusinessValidationException(
                    "Maximum amount if categories reached. Count: " + walletCount,
                    "WALLET_LIMIT_REACHED",
                    HttpStatus.BAD_REQUEST
            );
        }

        Integer maxSortOrder = walletRepository.findMaxSortOrderByUser(user);
        Integer nextSortOrder = (maxSortOrder == null || maxSortOrder == -1) ? 0 : maxSortOrder + 1;

        Wallet wallet = Wallet.builder()
                .name(request.name())
                .startingBalance(request.startingBalance())
                .sortOrder(nextSortOrder)
                .user(user)
                .build();

        walletRepository.saveAndFlush(wallet);
        return walletMapper.toWalletDetailsResponse(wallet);
    }

    public WalletDetailsResponse updateWallet(User user, UUID walletId, WalletRequest request) {
        Wallet wallet = walletRepository.findByUserAndId(user, walletId).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Wallet could not be found",
                        "RESOURCE_NOT_FOUND",
                        HttpStatus.NOT_FOUND)
        );

        wallet.setName(request.name());
        wallet.setStartingBalance(request.startingBalance());
        walletRepository.save(wallet);

        return walletMapper.toWalletDetailsResponse(wallet);
    }

    @Transactional
    public void deleteWallet(User user, UUID walletId) {
        Wallet wallet = walletRepository.findByUserAndId(user, walletId).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Wallet could not be found",
                        "RESOURCE_NOT_FOUND",
                        HttpStatus.NOT_FOUND)
        );
        transactionRepository.deleteAllByWallet(wallet);
        walletRepository.delete(wallet);

        reorderWalletsAfterDelete(user, wallet.getSortOrder());
    }

    @Transactional
    public void reorderWallets(User user, ReorderWalletRequest request) {
        List<Wallet> wallets = walletRepository.findByUserOrderBySortOrderAsc(user);

        Set<UUID> userWalletIds = wallets.stream()
                .map(Wallet::getId)
                .collect(Collectors.toSet());

        List<UUID> requestedIds = request.walletIds();

        if (requestedIds.size() != userWalletIds.size() || !userWalletIds.containsAll(requestedIds)) {
            throw new BusinessValidationException(
                    "Invalid wallet IDs provided",
                    "INVALID_WALLET_IDS",
                    HttpStatus.BAD_REQUEST
            );
        }

        Map<UUID, Wallet> walletMap = wallets.stream()
                .collect(Collectors.toMap(Wallet::getId, w -> w));

        for (int i = 0; i < requestedIds.size(); i++) {
            UUID walletId = requestedIds.get(i);
            Wallet wallet = walletMap.get(walletId);
            wallet.setSortOrder(i);
        }

        walletRepository.saveAll(wallets);
    }

    private void reorderWalletsAfterDelete(User user, Integer deletedSortOrder) {
        List<Wallet> wallets = walletRepository.findByUserOrderBySortOrderAsc(user);
        wallets.stream()
                .filter(w -> w.getSortOrder() > deletedSortOrder)
                .forEach(w -> w.setSortOrder(w.getSortOrder() - 1));

        walletRepository.saveAll(wallets);
    }

}
