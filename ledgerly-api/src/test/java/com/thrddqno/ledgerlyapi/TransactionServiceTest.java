package com.thrddqno.ledgerlyapi;

import com.thrddqno.ledgerlyapi.category.Category;
import com.thrddqno.ledgerlyapi.category.CategoryRepository;
import com.thrddqno.ledgerlyapi.transaction.*;
import com.thrddqno.ledgerlyapi.transaction.dto.TransactionRequest;
import com.thrddqno.ledgerlyapi.user.User;
import com.thrddqno.ledgerlyapi.wallet.Wallet;
import com.thrddqno.ledgerlyapi.wallet.WalletRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private WalletRepository walletRepository;
    @Mock
    private TransactionRepository transactionRepository;
    @Mock
    private TransactionMapper transactionMapper;
    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private TransactionService transactionService;

    private User user;
    private Wallet wallet;
    private Category category;
    private UUID walletId;
    private UUID categoryId;

    @BeforeEach
    void setUp() {
        walletId = UUID.randomUUID();
        categoryId = UUID.randomUUID();
        user = new User();

        wallet = Wallet.builder()
                .id(walletId)
                .user(user)
                .startingBalance(BigDecimal.valueOf(1000))
                .build();

        category = Category.builder()
                .id(categoryId)
                .transactionType(TransactionType.EXPENSE)
                .build();
    }

    @Test
    void createTransaction_ShouldSuccessfullyCreateAndApplyToWallet() {
        TransactionRequest request = new TransactionRequest(
                categoryId, "Coffee", BigDecimal.valueOf(50), LocalDate.now()
        );

        when(walletRepository.findByUserAndId(user, walletId)).thenReturn(Optional.of(wallet));
        when(categoryRepository.findByUserAndId(user, categoryId)).thenReturn(Optional.of(category));

        transactionService.createTransaction(user, walletId, request);

        verify(transactionRepository).save(any(Transaction.class));
        verify(walletRepository).save(wallet);

        assertThat(wallet.getCurrentBalance()).isEqualByComparingTo("950");
    }

    @Test
    void createTransaction_ShouldThrowException_WhenWalletNotFound() {
        TransactionRequest request = new TransactionRequest(categoryId, "Test", BigDecimal.valueOf(10), LocalDate.now());
        when(walletRepository.findByUserAndId(user, walletId)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () ->
                transactionService.createTransaction(user, walletId, request)
        );

        verify(transactionRepository, never()).save(any());
    }

    @Test
    void updateTransaction_ShouldRecalculateBalanceCorrectly() {
        UUID transactionId = UUID.randomUUID();
        Transaction existingTransaction = Transaction.builder()
                .id(transactionId)
                .amount(BigDecimal.valueOf(100))
                .transactionType(TransactionType.EXPENSE)
                .wallet(wallet)
                .build();

        TransactionRequest updateRequest = new TransactionRequest(categoryId, "Updated", BigDecimal.valueOf(200), LocalDate.now());

        when(walletRepository.findByUserAndId(user, walletId)).thenReturn(Optional.of(wallet));
        when(transactionRepository.findByWalletAndId(wallet, transactionId)).thenReturn(Optional.of(existingTransaction));
        when(categoryRepository.findByUserAndId(user, categoryId)).thenReturn(Optional.of(category));

        transactionService.updateTransaction(user, walletId, transactionId, updateRequest);

        assertThat(wallet.getCurrentBalance()).isEqualByComparingTo("900");
    }
}
