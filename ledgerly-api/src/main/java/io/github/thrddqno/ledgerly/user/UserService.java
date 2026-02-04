package io.github.thrddqno.ledgerly.user;

import org.mapstruct.factory.Mappers;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import io.github.thrddqno.ledgerly.common.security.SecurityUtils;
import io.github.thrddqno.ledgerly.user.dto.PasswordRequest;
import io.github.thrddqno.ledgerly.user.dto.UserDTO;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
	
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	
	private UserMapper mapper = Mappers.getMapper(UserMapper.class);
	
	//get userbyid
	public UserDTO getUser() {
		User user = SecurityUtils.currentUser();
		return mapper.toDTO(user);
	}
	
	//put userdetails
	public UserDTO updateDetails(UserDTO userDTO) {
		User user = SecurityUtils.currentUser();
		
		user.setFirstName(userDTO.firstName());
		user.setLastName(userDTO.lastName());
		user.setEmail(userDTO.email());
		
		userRepository.save(user);
		
		return mapper.toDTO(user);
	}
	
	//put userpassword
	public void updatePassword(PasswordRequest request) {
		User user = SecurityUtils.currentUser();
		
		if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
	        throw new RuntimeException("Old password is incorrect");
	    }
		
		user.setPassword(passwordEncoder.encode(request.newPassword()));
	    userRepository.save(user);
	}
	
	
	
	

}
