package com.thrddqno.ledgerlyapi.transaction;

import com.thrddqno.ledgerlyapi.category.Category;
import com.thrddqno.ledgerlyapi.category.CategoryRepository;
import com.thrddqno.ledgerlyapi.common.exception.BusinessValidationException;
import com.thrddqno.ledgerlyapi.common.exception.DataIntegrityException;
import com.thrddqno.ledgerlyapi.common.exception.ResourceNotFoundException;
import com.thrddqno.ledgerlyapi.common.exception.UnauthorizedException;
import com.thrddqno.ledgerlyapi.transaction.dto.*;
import com.thrddqno.ledgerlyapi.user.User;
import com.thrddqno.ledgerlyapi.wallet.Wallet;
import com.thrddqno.ledgerlyapi.wallet.WalletRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.Base64;
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
     * KEYSET PAGINATION (EXPERIMENT)
     * resource: https://www.youtube.com/watch?v=MOu-5B-UpCU
     */
    @Transactional
    public CursorPagedTransactionResponse<TransactionResponse> getNextTransactions(
            User user,
            UUID walletId,
            String cursor,
            LocalDate startDate,
            LocalDate endDate,
            int size
    ) {
        Wallet wallet = walletRepository.findByUserAndId(user, walletId).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Wallet could not be found",
                        "RESOURCE_NOT_FOUND",
                        HttpStatus.NOT_FOUND
                )
        );

        LocalDate lastDate = null;
        UUID lastId = null;
        if (cursor != null && !cursor.isBlank()) {
            String decoded = new String(Base64.getUrlDecoder().decode(cursor), StandardCharsets.UTF_8);
            String[] parts = decoded.split("\\|");
            if (parts.length != 2){
                throw new BusinessValidationException(
                        "Invalid Cursor",
                        "INVALID_CURSOR",
                        HttpStatus.BAD_REQUEST
                );
            }
            lastDate = LocalDate.parse(parts[0]);
            lastId = UUID.fromString(parts[1]);
        }


        Pageable limit = PageRequest.of(0, size);
        List<Transaction> transactions = transactionRepository.findTransactionsByWallet(
                wallet, startDate, endDate, lastDate, lastId, limit);

        return transactionMapper.toCursorPagedTransactionResponse(transactions, size);
    }


    //GET TRANSACTION
    @Transactional
    public TransactionResponse getTransaction(User user, UUID walletId, UUID transactionId){
        Wallet wallet = walletRepository.findByUserAndId(user, walletId).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Wallet could not be found",
                        "RESOURCE_NOT_FOUND",
                        HttpStatus.NOT_FOUND
                ));
        Transaction transaction = transactionRepository.findByWalletAndId(wallet, transactionId).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Transaction could not be found",
                        "RESOURCE_NOT_FOUND",
                        HttpStatus.NOT_FOUND
                ));
        return transactionMapper.toTransactionResponse(transaction);
    }

    @Transactional
    public PagedTransactionResponse<TransactionResponse> getAllTransactions(User user, UUID walletId, int page, int size){
        Wallet wallet = walletRepository.findByUserAndId(user, walletId).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Wallet could not be found",
                        "RESOURCE_NOT_FOUND",
                        HttpStatus.NOT_FOUND)
        );
        PageRequest pageRequest = PageRequest.of(page - 1, size);
        Page<Transaction> transactionResponsePage = transactionRepository.findAllByWallet(wallet, pageRequest);

        return transactionMapper.toPagedResponse(transactionResponsePage);
    }

    /**
     * POST METHODS
     */

    @Transactional
    public List<TransactionResponse> createTransfer(User user, TransferRequest request){
        Wallet source = walletRepository.findByUserAndId(user, request.sourceWalletId()).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Source Wallet could not be found",
                        "RESOURCE_NOT_FOUND",
                        HttpStatus.NOT_FOUND)
        );
        Wallet target = walletRepository.findByUserAndId(user, request.targetWalletId()).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Target Wallet could not be found",
                        "RESOURCE_NOT_FOUND",
                        HttpStatus.NOT_FOUND)
        );

        if (source.getId().equals(target.getId())){
            throw new BusinessValidationException(
                    "Cannot transfer funds to the same wallet",
                    "INVALID_TRANSFER_REQUEST",
                    HttpStatus.BAD_REQUEST
            );
        }

        Category OutTransferCategory = categoryRepository.findByUserAndNameAndTransactionType(user, "Outgoing Transfer", TransactionType.TRANSFER).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Category could not be found",
                        "RESOURCE_NOT_FOUND",
                        HttpStatus.NOT_FOUND)
        );
        Category InTransferCategory = categoryRepository.findByUserAndNameAndTransactionType(user, "Incoming Transfer", TransactionType.TRANSFER).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Category could not be found",
                        "RESOURCE_NOT_FOUND",
                        HttpStatus.NOT_FOUND)
        );

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
        Wallet wallet = walletRepository.findByUserAndId(user, walletId).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Wallet could not be found",
                        "RESOURCE_NOT_FOUND",
                        HttpStatus.NOT_FOUND)
        );
        Category category = categoryRepository.findByUserAndId(user, request.categoryId()).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Category could not be found",
                        "RESOURCE_NOT_FOUND",
                        HttpStatus.NOT_FOUND)
        );

        Transaction transaction = Transaction.builder()
                .notes(request.notes())
                .amount(request.amount().abs())
                .date(request.date())
                .category(category)
                .transactionType(category.getTransactionType())
                .wallet(wallet)
                .build();
        wallet.applyTransaction(transaction);
        transactionRepository.save(transaction);
        walletRepository.save(wallet);

        return transactionMapper.toTransactionResponse(transaction);
    }

    @Transactional
    public List<TransactionResponse> updateTransfer(User user, UUID transferId, TransferRequest request){
        Wallet source = walletRepository.findByUserAndId(user, request.sourceWalletId()).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Source Wallet could not be found",
                        "RESOURCE_NOT_FOUND",
                        HttpStatus.NOT_FOUND)
        );
        Wallet target = walletRepository.findByUserAndId(user, request.targetWalletId()).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Target Wallet could not be found",
                        "RESOURCE_NOT_FOUND",
                        HttpStatus.NOT_FOUND)
        );

        List<Transaction> transfers = getAndValidateTransfer(user,transferId);

        Transaction outgoing = transfers.stream().filter(transaction -> !transaction.isIncoming()).findFirst().orElseThrow(
                () -> new DataIntegrityException(
                        "Transfer is corrupted: missing outgoing transaction",
                        "DATA_INTEGRITY_VIOLATION",
                        HttpStatus.CONFLICT
                )
        );
        Transaction incoming = transfers.stream().filter(Transaction::isIncoming).findFirst().orElseThrow(
                () -> new DataIntegrityException(
                        "Transfer is corrupted: missing incoming transaction",
                        "DATA_INTEGRITY_VIOLATION",
                        HttpStatus.CONFLICT
                )
        );

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
        Wallet wallet = walletRepository.findByUserAndId(user, walletId).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Wallet could not be found",
                        "RESOURCE_NOT_FOUND",
                        HttpStatus.NOT_FOUND)
        );
        Transaction transaction = transactionRepository.findByWalletAndId(wallet, transactionId).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Transaction could not be found",
                        "RESOURCE_NOT_FOUND",
                        HttpStatus.NOT_FOUND)
        );
        Category category = categoryRepository.findByUserAndId(user, request.categoryId()).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Category could not be found",
                        "RESOURCE_NOT_FOUND",
                        HttpStatus.NOT_FOUND)
        );

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

        return transactionMapper.toTransactionResponse(transaction);
    }

    /**
     * DELETE METHODS
     */

    @Transactional
    public void deleteTransaction(User user, UUID walletId, UUID transactionId){
        Wallet wallet = walletRepository.findByUserAndId(user, walletId).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Wallet could not be found",
                        "RESOURCE_NOT_FOUND",
                        HttpStatus.NOT_FOUND)
        );

        Transaction transaction = transactionRepository.findByWalletAndId(wallet, transactionId).orElseThrow(
                () -> new ResourceNotFoundException(
                        "Transaction could not be found",
                        "RESOURCE_NOT_FOUND",
                        HttpStatus.NOT_FOUND)
        );
        wallet.removeTransaction(transaction);
        walletRepository.save(wallet);
        transactionRepository.delete(transaction);
    }

    @Transactional
    public void deleteTransfer(User user, UUID transferId){
        List<Transaction> transfers = getAndValidateTransfer(user, transferId);

        Transaction outgoing = transfers.stream().filter(transaction -> !transaction.isIncoming()).findFirst().orElseThrow(
                () -> new DataIntegrityException(
                        "Transfer is corrupted: missing outgoing transaction",
                        "DATA_INTEGRITY_VIOLATION",
                        HttpStatus.CONFLICT
                )
        );
        Transaction incoming = transfers.stream().filter(Transaction::isIncoming).findFirst().orElseThrow(
                () -> new DataIntegrityException(
                        "Transfer is corrupted: missing incoming transaction",
                        "DATA_INTEGRITY_VIOLATION",
                        HttpStatus.CONFLICT
                )
        );

        outgoing.getWallet().removeTransfer(outgoing);
        incoming.getWallet().removeTransfer(incoming);

        walletRepository.saveAll(List.of(outgoing.getWallet(), incoming.getWallet()));

        transactionRepository.deleteAll(transfers);
    }

    private List<Transaction> getAndValidateTransfer(User user, UUID transferId){
        List<Transaction> transfers = transactionRepository.findByTransferId(transferId);

        if(transfers.isEmpty()){
            throw new ResourceNotFoundException(
                    "Wallet could not be found",
                    "RESOURCE_NOT_FOUND",
                    HttpStatus.NOT_FOUND);
        }

        if(transfers.stream().anyMatch(transaction -> !transaction.getWallet().getUser().getId().equals(user.getId()))){
            throw new UnauthorizedException(
                    "User is not authorized to access this transaction",
                    "UNAUTHORIZED_ACCESS",
                    HttpStatus.FORBIDDEN
            );
        }

        if (transfers.size() != 2) {
            throw new DataIntegrityException(
                    "Transfer is incomplete or corrupted. Expected 2 transactions, but only received " + transfers.size(),
                    "DATA_INTEGRITY_VIOLATION",
                    HttpStatus.CONFLICT
            );
        }

        return transfers;
    }
}
