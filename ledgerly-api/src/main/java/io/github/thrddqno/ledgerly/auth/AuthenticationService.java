package io.github.thrddqno.ledgerly.auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import io.github.thrddqno.ledgerly.auth.dto.AuthenticationResponse;
import io.github.thrddqno.ledgerly.auth.dto.AuthenticationRequest;
import io.github.thrddqno.ledgerly.auth.dto.RegisterRequest;
import io.github.thrddqno.ledgerly.common.security.JwtService;
import io.github.thrddqno.ledgerly.user.Role;
import io.github.thrddqno.ledgerly.user.User;
import io.github.thrddqno.ledgerly.user.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
	
	private final UserRepository repository;
	
	private final JwtService jwtService;
	
	private final PasswordEncoder passwordEncoder;
	
	private final AuthenticationManager authenticationManager;
	
	public AuthenticationResponse register(RegisterRequest request) {
		System.out.println(request);
		var user = User.builder()
				.firstName(request.getFirstName())
				.lastName(request.getLastName())
				.email(request.getEmail())
				.password(passwordEncoder.encode(request.getPassword()))
				.role(Role.USER)
				.build();
		repository.save(user);
		var jwtToken = jwtService.generateToken(user);
		return AuthenticationResponse.builder().token(jwtToken).build();
	}

	public AuthenticationResponse authenticate(AuthenticationRequest request) {
		authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(
						request.getEmail(), 
						request.getPassword()
						)
				);
		var user = repository.findByEmail(request.getEmail()).orElseThrow();
		var jwtToken = jwtService.generateToken(user);
		return AuthenticationResponse.builder().token(jwtToken).build();
	}
	
}
