package com.thrddqno.ledgerlyapi.common.security.auth.exceptions;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor(force = true)
@Data
public class EmailAlreadyExistException extends RuntimeException{
    private final String errorCode;
    private final HttpStatus httpStatus;

    public EmailAlreadyExistException(String message, String errorCode, HttpStatus httpStatus) {
        super(message);
        this.httpStatus = httpStatus;
        this.errorCode = errorCode;
    }
}
