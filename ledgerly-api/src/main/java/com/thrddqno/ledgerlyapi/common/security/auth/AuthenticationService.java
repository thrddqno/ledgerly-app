package com.thrddqno.ledgerlyapi.common.security.auth;

import com.thrddqno.ledgerlyapi.category.CategorySeederService;
import com.thrddqno.ledgerlyapi.common.config.TokenProperties;
import com.thrddqno.ledgerlyapi.common.exception.ResourceNotFoundException;
import com.thrddqno.ledgerlyapi.common.security.JwtService;
import com.thrddqno.ledgerlyapi.common.security.JwtTokenCookieService;
import com.thrddqno.ledgerlyapi.common.security.auth.dto.LoginRequest;
import com.thrddqno.ledgerlyapi.common.security.auth.dto.RegisterRequest;
import com.thrddqno.ledgerlyapi.common.security.auth.exception.EmailAlreadyExistException;
import com.thrddqno.ledgerlyapi.common.security.auth.exception.InvalidCredentialsException;
import com.thrddqno.ledgerlyapi.common.security.auth.exception.UserNotFoundException;
import com.thrddqno.ledgerlyapi.user.User;
import com.thrddqno.ledgerlyapi.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HexFormat;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final CategorySeederService categorySeederService;
    private final JwtTokenCookieService jwtTokenCookieService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final TokenProperties tokenProperties;

    @Transactional
    public User register(RegisterRequest registerRequest) {
        if(userRepository.findByEmail(registerRequest.getEmail()).isPresent()){
            throw new EmailAlreadyExistException(
                    "Email already exists.",
                    "BAD_USER_INPUT",
                    HttpStatus.BAD_REQUEST);
        }

        var user = User.builder()
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(Role.USER)
                .build();
        userRepository.save(user);
        categorySeederService.seedDefaultCategories(user);
        return user;
    }

    public User login(LoginRequest loginRequest){
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );
        } catch (Exception e) {
            throw new InvalidCredentialsException(
                    "Your email or password is incorrect",
                    "BAD_USER_INPUT",
                    HttpStatus.UNAUTHORIZED
            );
        }

        User user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow(() ->
                new UserNotFoundException(
                        "User with email: " + loginRequest.getEmail() + " cannot be found.",
                        "BAD_USER_INPUT",
                        HttpStatus.NOT_FOUND
                ));

        refreshTokenRepository.deleteAllByUserAndExpiresAtBefore(user, Instant.now());

        return user;
    }

    public void logout(HttpServletRequest request, HttpServletResponse response){
        String refreshToken = extractRefreshTokenOrThrow(request);
        RefreshToken stored = findStoredTokenOrThrow(refreshToken);

        refreshTokenRepository.delete(stored);
        clearCookies(response);
    }

    public void issueTokens(User user, HttpServletResponse response){
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        RefreshToken entity = RefreshToken.builder()
                .user(user)
                .tokenHash(hash(refreshToken))
                .expiresAt(Instant.now().plusMillis(tokenProperties.getRefreshTokenExpiry()))
                .build();

        refreshTokenRepository.save(entity);

        response.addCookie(jwtTokenCookieService.createAccessTokenCookie(accessToken));
        response.addCookie(jwtTokenCookieService.createRefreshTokenCookie(refreshToken));
    }

    @Transactional
    public void refreshTokens(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = extractRefreshTokenOrThrow(request);
        RefreshToken stored = findStoredTokenOrThrow(refreshToken);

        if (stored.getExpiresAt().isBefore(Instant.now())) {
            refreshTokenRepository.delete(stored);
            throw new InvalidCredentialsException(
                    "Refresh token expired. Please login again.",
                    "TOKEN_EXPIRED",
                    HttpStatus.UNAUTHORIZED);
        }

        User user = stored.getUser();
        refreshTokenRepository.deleteAllByUserAndExpiresAtBefore(user, Instant.now());
        refreshTokenRepository.delete(stored);
        issueTokens(user, response);
    }

    private String extractRefreshTokenOrThrow(HttpServletRequest request) {
        String token = jwtTokenCookieService.extractRefreshToken(request);
        if (token == null) {
            throw new InvalidCredentialsException("Missing refresh token. Please login.",
                    "UNAUTHORIZED",
                    HttpStatus.UNAUTHORIZED);
        }
        return token;
    }

    private RefreshToken findStoredTokenOrThrow(String rawToken) {
        return refreshTokenRepository.findByTokenHash(hash(rawToken))
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Token not found. Please login again.",
                        "TOKEN_NOT_FOUND",
                        HttpStatus.NOT_FOUND));
    }

    private void clearCookies(HttpServletResponse response) {
        response.addCookie(jwtTokenCookieService.nullifyTokenCookie("access_token", "/"));
        response.addCookie(jwtTokenCookieService.nullifyTokenCookie("refresh_token", "/auth"));
    }

    private String hash(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashedBytes = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hashedBytes);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}
