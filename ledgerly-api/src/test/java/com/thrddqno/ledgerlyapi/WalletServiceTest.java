package com.thrddqno.ledgerlyapi;

import com.thrddqno.ledgerlyapi.user.User;
import com.thrddqno.ledgerlyapi.wallet.Wallet;
import com.thrddqno.ledgerlyapi.wallet.WalletMapper;
import com.thrddqno.ledgerlyapi.wallet.WalletRepository;
import com.thrddqno.ledgerlyapi.wallet.WalletService;
import com.thrddqno.ledgerlyapi.wallet.dto.WalletRequest;
import com.thrddqno.ledgerlyapi.wallet.dto.WalletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class WalletServiceTest {
    @Mock
    private WalletRepository walletRepository;
    @Mock
    private WalletMapper walletMapper;

    @InjectMocks
    private WalletService walletService;

    private User userA;
    private User userB;

    @BeforeEach
    void setUp() {
        userA = User.builder().id(UUID.randomUUID()).firstName("A").lastName("Test").email("userA@test.com").build();
        userB = User.builder().id(UUID.randomUUID()).firstName("B").lastName("Test").email("userB@test.com").build();
    }

    @Test
    void createWallet_ShouldThrowException_WhenLimitReached() {
        when(walletRepository.countByUser(userA)).thenReturn(10L);
        WalletRequest request = new WalletRequest("New Wallet", BigDecimal.ZERO);

        assertThrows(IllegalStateException.class, () -> walletService.createWallet(userA, request));
        verify(walletRepository, never()).save(any());
    }

    @Test
    void getWalletBalance_ShouldOnlyReturnIfOwnedByUser() {
        UUID walletId = UUID.randomUUID();
        Wallet walletA = Wallet.builder().id(walletId).user(userA).name("UserA Savings").build();

        when(walletRepository.findByUserAndId(userA, walletId)).thenReturn(Optional.of(walletA));
        when(walletMapper.toWalletResponse(walletA)).thenReturn(new WalletResponse("UserA Savings", BigDecimal.ZERO));


        WalletResponse result = walletService.getWalletBalance(userA, walletId);

        assertEquals("UserA Savings", result.name());

        when(walletRepository.findByUserAndId(userB, walletId)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> walletService.getWalletBalance(userB, walletId));
    }


}
