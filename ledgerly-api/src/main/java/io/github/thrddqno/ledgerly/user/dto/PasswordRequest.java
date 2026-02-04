package io.github.thrddqno.ledgerly.user.dto;

public record PasswordRequest(
		String oldPassword,
		String newPassword
		){

}
