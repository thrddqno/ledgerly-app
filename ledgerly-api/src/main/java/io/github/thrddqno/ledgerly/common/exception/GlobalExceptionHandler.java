package io.github.thrddqno.ledgerly.common.exception;

import java.nio.file.AccessDeniedException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import io.github.thrddqno.ledgerly.user.exceptions.EmailAlreadyExistsException;
import io.github.thrddqno.ledgerly.user.exceptions.InvalidCredentialsException;
import io.github.thrddqno.ledgerly.user.exceptions.InvalidUserDataException;
import io.github.thrddqno.ledgerly.user.exceptions.OldPasswordIncorrectException;

@RestControllerAdvice
public class GlobalExceptionHandler {
	
	@ExceptionHandler(InvalidCredentialsException.class)
	public ResponseEntity<String> handleInvalidCredentials(InvalidCredentialsException e){
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
	}
	
	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<String> handleAccessDenied(AccessDeniedException e){
		return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
	}
	
	@ExceptionHandler(OldPasswordIncorrectException.class)
	public ResponseEntity<String> handleOldPassword(OldPasswordIncorrectException e){
		return ResponseEntity.badRequest().body(e.getMessage());
	}
	
	@ExceptionHandler(EmailAlreadyExistsException.class)
	public ResponseEntity<String> handleEmailExists(EmailAlreadyExistsException e){
		return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
	}
	
	@ExceptionHandler(InvalidUserDataException.class)
    public ResponseEntity<String> handleInvalidUserData(InvalidUserDataException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
	
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntime(RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }

}
