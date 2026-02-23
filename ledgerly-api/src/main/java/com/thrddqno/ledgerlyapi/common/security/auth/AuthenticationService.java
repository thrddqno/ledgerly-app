package com.thrddqno.ledgerlyapi.common.security.auth;

import com.thrddqno.ledgerlyapi.common.security.JwtService;
import com.thrddqno.ledgerlyapi.common.security.auth.dto.AuthenticationResponse;
import com.thrddqno.ledgerlyapi.common.security.auth.dto.LoginRequest;
import com.thrddqno.ledgerlyapi.common.security.auth.dto.RegisterRequest;
import com.thrddqno.ledgerlyapi.user.User;
import com.thrddqno.ledgerlyapi.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthenticationResponse register(RegisterRequest registerRequest) throws Exception {
        //TODO: implement EmailAlreadyExist exception and remove method signature
        if(userRepository.findByEmail(registerRequest.getEmail()).isPresent()){
            throw new Exception();
        }

        var user = User.builder()
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(Role.USER)
                .build();
        userRepository.save(user);
        var token = jwtService.generateToken(user);
        return AuthenticationResponse.builder().token(token).build();
    }

    @Transactional
    public AuthenticationResponse login(LoginRequest loginRequest) throws Exception {
        //TODO: implement InvalidCredentials exception and remove method signature
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );
        } catch (Exception e) {
            throw new Exception();
        }

        //TODO: implement UserNotFound exception
        var user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow();
        var token = jwtService.generateToken(user);
        return AuthenticationResponse.builder().token(token).build();
    }
}
