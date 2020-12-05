package com.koop.app.config.tenancy;

public final class UnknownTenantException extends RuntimeException {

    public UnknownTenantException(final String message) {
        super(message);
    }
}
