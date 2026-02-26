package com.thrddqno.ledgerlyapi.transaction;

import com.thrddqno.ledgerlyapi.category.Category;
import com.thrddqno.ledgerlyapi.category.CategoryRepository;
import com.thrddqno.ledgerlyapi.transaction.dto.PagedTransactionResponse;
import com.thrddqno.ledgerlyapi.transaction.dto.TransactionRequest;
import com.thrddqno.ledgerlyapi.transaction.dto.TransactionResponse;
import com.thrddqno.ledgerlyapi.user.User;
import com.thrddqno.ledgerlyapi.wallet.Wallet;
import com.thrddqno.ledgerlyapi.wallet.WalletRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final TransactionMapper transactionMapper;
    private final CategoryRepository categoryRepository;

    /**
     * GET METHODS
     */

    //GET TRANSACTION
    @Transactional
    public TransactionResponse getTransaction(User user, UUID walletId, UUID transactionId){
        Wallet wallet = walletRepository.findByUserAndId(user, walletId).orElseThrow();
        Transaction transaction = transactionRepository.findByWalletAndId(wallet, transactionId).orElseThrow();
        return transactionMapper.toTransactionResponse(transaction);
    }

    @Transactional
    public PagedTransactionResponse<TransactionResponse> getAllTransactions(User user, UUID walletId, int page, int size){
        Wallet wallet = walletRepository.findByUserAndId(user, walletId).orElseThrow();
        PageRequest pageRequest = PageRequest.of(page - 1, size);
        Page<Transaction> transactionResponsePage = transactionRepository.findAllByWallet(wallet, pageRequest);
        return transactionMapper.toPagedResponse(transactionResponsePage);
    }

    /**
     * POST METHODS
     */
    @Transactional
    public TransactionResponse createTransaction(User user, UUID walletId, TransactionRequest request){
        //TODO: add resourcenotfound exception handling
        Wallet wallet = walletRepository.findByUserAndId(user, walletId).orElseThrow();
        Category category = categoryRepository.findByUserAndId(user, request.categoryId()).orElseThrow();

        Transaction transaction = Transaction.builder()
                .notes(request.notes())
                .amount(request.amount().abs())
                .date(request.date())
                .category(category)
                .transactionType(category.getTransactionType()) //get from category for now
                .wallet(wallet)
                .build();
        wallet.applyTransaction(transaction);
        transactionRepository.save(transaction);
        walletRepository.save(wallet);

        return transactionMapper.toTransactionResponse(transaction);
    }

    /**
     * PUT METHODS
     */
    @Transactional
    public TransactionResponse updateTransaction(User user, UUID walletId, UUID transactionId, TransactionRequest request){
        Wallet wallet = walletRepository.findByUserAndId(user, walletId).orElseThrow();
        Transaction transaction = transactionRepository.findByWalletAndId(wallet, transactionId).orElseThrow();
        Category category = categoryRepository.findByUserAndId(user, request.categoryId()).orElseThrow();

        //redo balance
        wallet.removeTransaction(transaction);

        transaction.setNotes(request.notes());
        transaction.setAmount(request.amount().abs());
        transaction.setDate(request.date());
        transaction.setCategory(category);
        transaction.setTransactionType(category.getTransactionType());

        wallet.applyTransaction(transaction);
        transactionRepository.save(transaction);
        walletRepository.save(wallet);

        return  transactionMapper.toTransactionResponse(transaction);
    }

    /**
     * DELETE METHODS
     */

    @Transactional
    public void deleteTransaction(User user, UUID walletId, UUID transactionId){
        Wallet wallet = walletRepository.findByUserAndId(user, walletId).orElseThrow();

        Transaction transaction = transactionRepository.findByWalletAndId(wallet, transactionId).orElseThrow();
        wallet.removeTransaction(transaction);
        walletRepository.save(wallet);
        transactionRepository.delete(transaction);
    }
}
