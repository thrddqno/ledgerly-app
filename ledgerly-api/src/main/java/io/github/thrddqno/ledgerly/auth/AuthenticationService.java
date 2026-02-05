package io.github.thrddqno.ledgerly.auth;

import java.util.List;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import io.github.thrddqno.ledgerly.auth.dto.AuthenticationResponse;
import io.github.thrddqno.ledgerly.auth.dto.AuthenticationRequest;
import io.github.thrddqno.ledgerly.auth.dto.RegisterRequest;
import io.github.thrddqno.ledgerly.category.Category;
import io.github.thrddqno.ledgerly.category.CategoryRepository;
import io.github.thrddqno.ledgerly.category.defaults.DefaultCategories;
import io.github.thrddqno.ledgerly.common.security.JwtService;
import io.github.thrddqno.ledgerly.user.Role;
import io.github.thrddqno.ledgerly.user.User;
import io.github.thrddqno.ledgerly.user.UserRepository;
import io.github.thrddqno.ledgerly.user.exceptions.EmailAlreadyExistsException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
	
	private final UserRepository repository;
	
	private final JwtService jwtService;
	
	private final PasswordEncoder passwordEncoder;
	
	private final AuthenticationManager authenticationManager;
	
	private final CategoryRepository categoryRepository;
	
	public AuthenticationResponse register(RegisterRequest request) {
		if (repository.findByEmail(request.getEmail()).isPresent()) {
		    throw new EmailAlreadyExistsException("Email is already registered");
		}
		var user = User.builder()
				.firstName(request.getFirstName())
				.lastName(request.getLastName())
				.email(request.getEmail())
				.password(passwordEncoder.encode(request.getPassword()))
				.role(Role.USER)
				.build();
		repository.save(user);
		var jwtToken = jwtService.generateToken(user);
		seedDefaultCategories(user);
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
	
	private void seedDefaultCategories(User user) {
	    List<Category> categories = DefaultCategories.DEFAULTS.stream()
	        .map(template -> Category.builder()
	            .name(template.name())
	            .color(template.color())
	            .icon(template.icon())
	            .type(template.type())
	            .user(user)
	            .build()
	        )
	        .toList();

	    categoryRepository.saveAll(categories);
	}
	
}
