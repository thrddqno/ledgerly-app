package io.github.thrddqno.ledgerly.user;

import org.mapstruct.Mapper;

import io.github.thrddqno.ledgerly.user.dto.UserDTO;

@Mapper(componentModel = "spring")
public interface UserMapper {
	
	UserDTO toDTO(User user);

}
