package com.thrddqno.ledgerlyapi.common.security.auth;

import com.thrddqno.ledgerlyapi.common.security.JwtService;
import com.thrddqno.ledgerlyapi.common.security.auth.dto.AuthenticationResponse;
import com.thrddqno.ledgerlyapi.common.security.auth.dto.LoginRequest;
import com.thrddqno.ledgerlyapi.common.security.auth.dto.RegisterRequest;
import com.thrddqno.ledgerlyapi.common.security.auth.exception.EmailAlreadyExistException;
import com.thrddqno.ledgerlyapi.common.security.auth.exception.InvalidCredentialsException;
import com.thrddqno.ledgerlyapi.common.security.auth.exception.UserNotFoundException;
import com.thrddqno.ledgerlyapi.user.User;
import com.thrddqno.ledgerlyapi.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
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
    public AuthenticationResponse register(RegisterRequest registerRequest) {
        if(userRepository.findByEmail(registerRequest.getEmail()).isPresent()){
            throw new EmailAlreadyExistException(
                    "Email: " + registerRequest.getEmail() + " already exists.",
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
        var token = jwtService.generateToken(user);
        return AuthenticationResponse.builder().token(token).build();
    }

    @Transactional
    public AuthenticationResponse login(LoginRequest loginRequest){
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new InvalidCredentialsException(
                    "Your email or password is incorrect",
                    "BAD_USER_INPUT",
                    HttpStatus.UNAUTHORIZED
            );
        }

        var user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow(() ->
                new UserNotFoundException(
                        "User with email: " + loginRequest.getEmail() + " cannot be found.",
                        "BAD_USER_INPUT",
                        HttpStatus.NOT_FOUND
                ));
        var token = jwtService.generateToken(user);
        return AuthenticationResponse.builder().token(token).build();
    }
}
