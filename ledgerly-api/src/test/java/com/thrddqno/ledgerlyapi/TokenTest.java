package com.thrddqno.ledgerlyapi;

import com.thrddqno.ledgerlyapi.common.security.auth.RefreshTokenRepository;
import com.thrddqno.ledgerlyapi.common.security.auth.Role;
import com.thrddqno.ledgerlyapi.user.User;
import com.thrddqno.ledgerlyapi.user.UserRepository;
import jakarta.servlet.http.Cookie;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import jakarta.transaction.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.MethodOrderer.OrderAnnotation;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Slf4j
@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@TestMethodOrder(OrderAnnotation.class)
@Transactional
class TokenTest {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @DynamicPropertySource
    static void registerProperties(DynamicPropertyRegistry registry) {
        registry.add("JWT_SECRET_KEY", () -> "c3BlbnR0cmFkZW5lYXJlc3RzaW5na2l0Y2hlbm5hdGl2ZW1vdmlldG9wcGV0YmVhdXR5Z290c3RydWdnbGVybw==");
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UserRepository userRepository;

    private static final String EMAIL = "test@test.com";
    private static final String PASSWORD = "password123";

    @Test
    @Order(1)
    void register_shouldIssueTokens() throws Exception {

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {
                          "firstName": "Test",
                          "lastName": "User",
                          "email": "%s",
                          "password": "%s"
                        }
                        """.formatted(EMAIL, PASSWORD)))
                .andExpect(status().isOk())
                .andExpect(cookie().exists("access_token"))
                .andExpect(cookie().exists("refresh_token"));

        assertThat(userRepository.findByEmail(EMAIL)).isPresent();
        assertThat(refreshTokenRepository.count()).isEqualTo(1);
    }

    @Test
    @Order(2)
    void login_shouldIssueTokens() throws Exception {

        User user = new User();
        user.setEmail(EMAIL);
        user.setPassword(passwordEncoder.encode(PASSWORD));
        user.setFirstName("Test");
        user.setLastName("User");
        user.setRole(Role.USER);
        userRepository.save(user);

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {
                          "email": "%s",
                          "password": "%s"
                        }
                        """.formatted(EMAIL, PASSWORD)))
                .andExpect(status().isOk())
                .andExpect(cookie().exists("access_token"))
                .andExpect(cookie().exists("refresh_token"));

        assertThat(refreshTokenRepository.count()).isGreaterThanOrEqualTo(1);
    }

    @Test
    @Order(3)
    void refresh_shouldRotateToken() throws Exception {

        User user = new User();
        user.setEmail(EMAIL);
        user.setPassword(passwordEncoder.encode(PASSWORD));
        user.setFirstName("Test");
        user.setLastName("User");
        user.setRole(Role.USER);
        userRepository.save(user);

        MvcResult loginResult = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                        {
                          "email": "%s",
                          "password": "%s"
                        }
                        """.formatted(EMAIL, PASSWORD)))
                .andExpect(status().isOk())
                .andReturn();

        Cookie oldRefresh = loginResult.getResponse().getCookie("refresh_token");

        oldRefresh.setPath("/auth/refresh");

        long tokenCountBefore = refreshTokenRepository.count();

        MvcResult refreshResult = mockMvc.perform(post("/auth/refresh")
                        .cookie(oldRefresh))
                .andExpect(status().isOk())
                .andExpect(cookie().exists("access_token"))
                .andExpect(cookie().exists("refresh_token"))
                .andReturn();

        var newRefresh = refreshResult.getResponse().getCookie("refresh_token");

        long tokenCountAfter = refreshTokenRepository.count();

        assertThat(newRefresh).isNotNull();
        assertThat(newRefresh.getValue()).isNotEqualTo(oldRefresh.getValue());

        assertThat(tokenCountAfter).isEqualTo(tokenCountBefore);

    }

    @Test
    @Order(4)
    void refresh_withInvalidToken_shouldReturn401() throws Exception {

        MockCookie invalidCookie =
                new MockCookie("refresh_token", "invalid.token.value");

        mockMvc.perform(post("/auth/refresh")
                        .cookie(invalidCookie))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(5)
    void refresh_withoutCookie_shouldReturn401() throws Exception {

        mockMvc.perform(post("/auth/refresh"))
                .andExpect(status().isUnauthorized());
    }
}