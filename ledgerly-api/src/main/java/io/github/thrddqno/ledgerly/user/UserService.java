package io.github.thrddqno.ledgerly.user;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import io.github.thrddqno.ledgerly.common.security.SecurityUtils;
import io.github.thrddqno.ledgerly.user.dto.PasswordRequest;
import io.github.thrddqno.ledgerly.user.dto.UserRequest;
import io.github.thrddqno.ledgerly.user.exceptions.InvalidUserDataException;
import io.github.thrddqno.ledgerly.user.exceptions.OldPasswordIncorrectException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
	
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	
	private UserMapper mapper;
	
	//get userbyid
	public UserRequest getUser(User user) {
		return mapper.toDTO(user);
	}
	
	//put userdetails
	public UserRequest updateDetails(User user, UserRequest userDTO) throws InvalidUserDataException{
		
		user.setFirstName(userDTO.firstName());
		user.setLastName(userDTO.lastName());
		user.setEmail(userDTO.email());
		
		userRepository.save(user);
		
		return mapper.toDTO(user);
	}
	
	//put userpassword
	public void updatePassword(User user, PasswordRequest request) {
		
		if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
	        throw new OldPasswordIncorrectException("Old password is incorrect");
	    }
		
		user.setPassword(passwordEncoder.encode(request.newPassword()));
	    userRepository.save(user);
	}
	
	
	
	

}
