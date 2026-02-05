package io.github.thrddqno.ledgerly.user;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.github.thrddqno.ledgerly.user.dto.PasswordRequest;
import io.github.thrddqno.ledgerly.user.dto.UserRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
	
	private final UserService service;
	
	@GetMapping
	public ResponseEntity<UserRequest> getUser(@AuthenticationPrincipal User user){
		UserRequest userDTO = service.getUser(user);
		return ResponseEntity.ok(userDTO);
	}
	
	@PutMapping("/details")
	public ResponseEntity<UserRequest> updateDetails(@AuthenticationPrincipal User user, @RequestBody UserRequest userDTO){
		UserRequest updated = service.updateDetails(user, userDTO);
		return ResponseEntity.ok(updated);
	}
	
	@PutMapping("/password")
	public ResponseEntity<String> updatePassword(@AuthenticationPrincipal User user, @RequestBody PasswordRequest passwordRequest){
		service.updatePassword(user, passwordRequest);
		return ResponseEntity.ok("Password updated successfully");
	}
}
