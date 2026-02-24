package com.thrddqno.ledgerlyapi.common.security.auth.exception;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor(force = true)
@Data
public class InvalidCredentialsException extends RuntimeException{
    private final String errorCode;
    private final HttpStatus httpStatus;

    public InvalidCredentialsException(String message, String errorCode, HttpStatus httpStatus) {
        super(message);
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
    }
}
