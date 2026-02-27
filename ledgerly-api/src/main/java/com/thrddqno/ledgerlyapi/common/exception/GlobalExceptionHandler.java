package com.thrddqno.ledgerlyapi.common.exception;

import com.thrddqno.ledgerlyapi.common.exception.dto.ErrorResponse;
import com.thrddqno.ledgerlyapi.common.security.auth.exception.EmailAlreadyExistException;
import com.thrddqno.ledgerlyapi.common.security.auth.exception.InvalidCredentialsException;
import com.thrddqno.ledgerlyapi.common.security.auth.exception.UserNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EmailAlreadyExistException.class)
    public ResponseEntity<ErrorResponse> handleEmailAlreadyExistException(EmailAlreadyExistException e, HttpServletRequest request){
        ErrorResponse error = ErrorResponse.builder()
                .errorCode(e.getErrorCode())
                .message(e.getMessage())
                .status(e.getHttpStatus().value())
                .timestamp(Instant.now())
                .path(request.getRequestURI())
                .build();
        return new ResponseEntity<>(error,e.getHttpStatus());
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCredentialsException(InvalidCredentialsException e, HttpServletRequest request){
        ErrorResponse error = ErrorResponse.builder()
                .errorCode(e.getErrorCode())
                .message(e.getMessage())
                .status(e.getHttpStatus().value())
                .timestamp(Instant.now())
                .path(request.getRequestURI())
                .build();
        return new ResponseEntity<>(error,e.getHttpStatus());
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFoundException(UserNotFoundException e, HttpServletRequest request){
        ErrorResponse error = ErrorResponse.builder()
                .errorCode(e.getErrorCode())
                .message(e.getMessage())
                .status(e.getHttpStatus().value())
                .timestamp(Instant.now())
                .path(request.getRequestURI())
                .build();
        return new ResponseEntity<>(error,e.getHttpStatus());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException e, HttpServletRequest request){
        ErrorResponse error = ErrorResponse.builder()
                .errorCode(e.getErrorCode())
                .message(e.getMessage())
                .status(e.getHttpStatus().value())
                .timestamp(Instant.now())
                .path(request.getRequestURI())
                .build();
        return new ResponseEntity<>(error,e.getHttpStatus());
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorizedException(UnauthorizedException e, HttpServletRequest request){
        ErrorResponse error = ErrorResponse.builder()
                .errorCode(e.getErrorCode())
                .message(e.getMessage())
                .status(e.getHttpStatus().value())
                .timestamp(Instant.now())
                .path(request.getRequestURI())
                .build();
        return new ResponseEntity<>(error,e.getHttpStatus());
    }

    @ExceptionHandler(DataIntegrityException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityException(DataIntegrityException e, HttpServletRequest request){
        ErrorResponse error = ErrorResponse.builder()
                .errorCode(e.getErrorCode())
                .message(e.getMessage())
                .status(e.getHttpStatus().value())
                .timestamp(Instant.now())
                .path(request.getRequestURI())
                .build();
        return new ResponseEntity<>(error,e.getHttpStatus());
    }

    @ExceptionHandler(BusinessValidationException.class)
    public ResponseEntity<ErrorResponse> handleBusinessValidationException(BusinessValidationException e, HttpServletRequest request){
        ErrorResponse error = ErrorResponse.builder()
                .errorCode(e.getErrorCode())
                .message(e.getMessage())
                .status(e.getHttpStatus().value())
                .timestamp(Instant.now())
                .path(request.getRequestURI())
                .build();
        return new ResponseEntity<>(error,e.getHttpStatus());
    }
}
