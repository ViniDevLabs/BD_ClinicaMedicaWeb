package com.clinicamedica.exception;

public class TokenInvalidoException extends RuntimeException {

    public TokenInvalidoException(String message) {
        super(message);
    }

    public TokenInvalidoException(String message, Throwable cause) {
        super(message, cause);
    }
}