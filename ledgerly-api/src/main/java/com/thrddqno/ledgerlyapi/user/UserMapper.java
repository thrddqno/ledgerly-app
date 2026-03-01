package com.thrddqno.ledgerlyapi.user;

import com.thrddqno.ledgerlyapi.user.dto.UserResponse;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponse toUserResponse(User user);

}
