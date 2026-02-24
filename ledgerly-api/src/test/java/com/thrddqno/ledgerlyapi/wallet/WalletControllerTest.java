package com.thrddqno.ledgerlyapi.wallet;

import com.thrddqno.ledgerlyapi.user.User;
import com.thrddqno.ledgerlyapi.wallet.dto.WalletDetailsResponse;
import com.thrddqno.ledgerlyapi.wallet.dto.WalletRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(WalletController.class)
@AutoConfigureMockMvc(addFilters = false)
class WalletControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private WalletService walletService;
    @MockitoBean
    private com.thrddqno.ledgerlyapi.common.security.JwtService jwtService;

    @MockitoBean
    private org.springframework.security.core.userdetails.UserDetailsService userDetailsService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createWallet_ShouldReturnCreatedWallet() throws Exception {
        UUID walletId = UUID.randomUUID();
        WalletRequest request = new WalletRequest("Travel Fund", new BigDecimal("1000"));
        WalletDetailsResponse response = new WalletDetailsResponse(
                walletId, "Travel Fund", "1000", "0", LocalDateTime.now()
        );

        when(walletService.createWallet(any(), any())).thenReturn(response);

        mockMvc.perform(post("/api/v1/wallet")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Travel Fund"));
    }

    @Test
    void deleteWallet_ShouldReturnNoContent() throws Exception {
        UUID walletId = UUID.randomUUID();

        mockMvc.perform(delete("/api/v1/wallet/{id}", walletId))
                .andExpect(status().isNoContent());

        verify(walletService, times(1)).deleteWallet(any(), eq(walletId));
    }
}
