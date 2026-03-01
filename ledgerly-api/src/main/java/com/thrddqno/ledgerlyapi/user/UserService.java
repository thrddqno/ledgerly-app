package com.thrddqno.ledgerlyapi.user;

import com.thrddqno.ledgerlyapi.user.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {


    private final UserMapper userMapper;

    public UserResponse getMe(User user){
        return userMapper.toUserResponse(user);
    }
}
