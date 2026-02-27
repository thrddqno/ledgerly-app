package com.thrddqno.ledgerlyapi.transaction;

import com.thrddqno.ledgerlyapi.category.Category;
import com.thrddqno.ledgerlyapi.category.CategoryRepository;
import com.thrddqno.ledgerlyapi.transaction.dto.PagedTransactionResponse;
import com.thrddqno.ledgerlyapi.transaction.dto.TransactionRequest;
import com.thrddqno.ledgerlyapi.transaction.dto.TransactionResponse;
import com.thrddqno.ledgerlyapi.transaction.dto.TransferRequest;
import com.thrddqno.ledgerlyapi.user.User;
import com.thrddqno.ledgerlyapi.wallet.Wallet;
import com.thrddqno.ledgerlyapi.wallet.WalletRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
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
    public List<TransactionResponse> createTransfer(User user, TransferRequest request){
        Wallet source = walletRepository.findByUserAndId(user, request.sourceWalletId()).orElseThrow();
        Wallet target = walletRepository.findByUserAndId(user, request.targetWalletId()).orElseThrow();

        if (source.getId().equals(target.getId())){
            throw new IllegalArgumentException("Cannot transfer funds to the same wallet");
        }

        Category OutTransferCategory = categoryRepository.findByUserAndNameAndTransactionType(user, "Outgoing Transfer", TransactionType.TRANSFER).orElseThrow();
        Category InTransferCategory = categoryRepository.findByUserAndNameAndTransactionType(user, "Incoming Transfer", TransactionType.TRANSFER).orElseThrow();

        UUID transferId = UUID.randomUUID();

        //from source
        Transaction outgoing = Transaction.builder()
                .notes("Transfer to " + target.getName())
                .amount(request.amount())
                .date(request.date())
                .transactionType(TransactionType.TRANSFER)
                .category(OutTransferCategory)
                .wallet(source)
                .transferId(transferId)
                .isIncoming(false)
                .build();
        //to target
        Transaction incoming = Transaction.builder()
                .notes("Transfer from " + source.getName())
                .amount(request.amount())
                .date(request.date())
                .transactionType(TransactionType.TRANSFER)
                .category(InTransferCategory)
                .wallet(target)
                .transferId(transferId)
                .isIncoming(true)
                .build();

        outgoing.setRelatedTransaction(incoming);
        incoming.setRelatedTransaction(outgoing);

        source.applyTransfer(outgoing);
        target.applyTransfer(incoming);

        walletRepository.saveAll(List.of(source,target));

        List<Transaction> saved = transactionRepository.saveAll(List.of(outgoing, incoming));

        return saved.stream().map(transactionMapper::toTransactionResponse).toList();
    }

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

    @Transactional
    public List<TransactionResponse> updateTransfer(User user, UUID transferId, TransferRequest request){
        Wallet source = walletRepository.findByUserAndId(user, request.sourceWalletId()).orElseThrow();
        Wallet target = walletRepository.findByUserAndId(user, request.targetWalletId()).orElseThrow();

        List<Transaction> transfers = transactionRepository.findByTransferId(transferId);

        if(transfers.stream().allMatch(transaction -> transaction.getWallet().getUser() == user)){
            throw new IllegalArgumentException("Unauthorized: Transfer does not belong to user");
        }

        if (transfers.size() != 2) {
            throw new IllegalStateException("Transfer is incomplete or corrupted");
        }

        Transaction outgoing = transfers.stream().filter(transaction -> !transaction.isIncoming()).findFirst().orElseThrow();
        Transaction incoming = transfers.stream().filter(Transaction::isIncoming).findFirst().orElseThrow();

        outgoing.getWallet().removeTransfer(outgoing);
        incoming.getWallet().removeTransfer(incoming);

        outgoing.setAmount(request.amount());
        outgoing.setDate(request.date());
        outgoing.setNotes("Transfer to " + target.getName());
        outgoing.setWallet(source);

        incoming.setAmount(request.amount());
        incoming.setDate(request.date());
        incoming.setNotes("Transfer from " + source.getName());
        incoming.setWallet(target);

        source.applyTransfer(outgoing);
        target.applyTransfer(incoming);

        walletRepository.saveAll(List.of(source,target));

        List<Transaction> saved = transactionRepository.saveAll(List.of(outgoing, incoming));

        return saved.stream().map(transactionMapper::toTransactionResponse).toList();
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

    @Transactional
    public void deleteTransfer(User user, UUID transferId){
        List<Transaction> transfers = transactionRepository.findByTransferId(transferId);

        if(transfers.stream().allMatch(transaction -> transaction.getWallet().getUser() == user)){
            throw new IllegalArgumentException("Unauthorized: Transfer does not belong to user");
        }

        if (transfers.size() != 2) {
            throw new IllegalStateException("Transfer is incomplete or corrupted");
        }

        Transaction outgoing = transfers.stream().filter(transaction -> !transaction.isIncoming()).findFirst().orElseThrow();
        Transaction incoming = transfers.stream().filter(Transaction::isIncoming).findFirst().orElseThrow();

        outgoing.getWallet().removeTransfer(outgoing);
        incoming.getWallet().removeTransfer(incoming);

        walletRepository.saveAll(List.of(outgoing.getWallet(), incoming.getWallet()));

        transactionRepository.deleteAll(transfers);

    }
}
