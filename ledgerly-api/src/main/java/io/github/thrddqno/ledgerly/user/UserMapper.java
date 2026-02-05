package io.github.thrddqno.ledgerly.user;

import org.mapstruct.Mapper;

import io.github.thrddqno.ledgerly.user.dto.UserRequest;

@Mapper(componentModel = "spring")
public interface UserMapper {
	
	UserRequest toDTO(User user);

}
