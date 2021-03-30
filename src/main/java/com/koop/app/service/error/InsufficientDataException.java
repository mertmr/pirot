package com.koop.app.service.error;

public class InsufficientDataException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public InsufficientDataException(String message, Exception e) {
        super(message, e);
    }
}
