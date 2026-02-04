package io.github.thrddqno.ledgerly.user;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.github.thrddqno.ledgerly.user.dto.PasswordRequest;
import io.github.thrddqno.ledgerly.user.dto.UserDTO;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
	
	private final UserService service;
	
	@GetMapping
	public ResponseEntity<UserDTO> getUser(){
		UserDTO userDTO = service.getUser();
		return ResponseEntity.ok(userDTO);
	}
	
	@PutMapping("/details")
	public ResponseEntity<UserDTO> updateDetails(@RequestBody UserDTO userDTO){
		UserDTO updated = service.updateDetails(userDTO);
		return ResponseEntity.ok(updated);
	}
	
	@PutMapping("/password")
	public ResponseEntity<String> updatePassword(@RequestBody PasswordRequest passwordRequest){
		service.updatePassword(passwordRequest);
		return ResponseEntity.ok("Password updated successfully");
	}

}
