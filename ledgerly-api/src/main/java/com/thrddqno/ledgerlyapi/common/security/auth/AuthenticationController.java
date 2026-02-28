package com.thrddqno.ledgerlyapi.common.security.auth;

import com.thrddqno.ledgerlyapi.common.security.JwtService;
import com.thrddqno.ledgerlyapi.common.security.auth.dto.LoginRequest;
import com.thrddqno.ledgerlyapi.common.security.auth.dto.RegisterRequest;
import com.thrddqno.ledgerlyapi.user.User;
import com.thrddqno.ledgerlyapi.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody RegisterRequest request, HttpServletResponse response) throws Exception {
        User user = authenticationService.register(request);
        authenticationService.issueTokens(user, response);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<Void> login(@RequestBody LoginRequest request, HttpServletResponse response) throws Exception {
        User user = authenticationService.login(request);
        authenticationService.issueTokens(user, response);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response){
        authenticationService.logout(request, response);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<Void> refresh(HttpServletRequest request, HttpServletResponse response) {
        authenticationService.refreshTokens(request, response);
        return ResponseEntity.ok().build();
    }
}
