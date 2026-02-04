package io.github.thrddqno.ledgerly.user.exceptions;

public class OldPasswordIncorrectException extends RuntimeException{
	public OldPasswordIncorrectException(String message) { 
		super(message);
	}
}
