package io.github.thrddqno.ledgerly.common.security;

import org.springframework.security.core.context.SecurityContextHolder;

import io.github.thrddqno.ledgerly.user.User;

public class SecurityUtils {
	public static User currentUser() {
		return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
	}
}
