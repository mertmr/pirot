package com.koop.app.config.tenancy;

import com.koop.app.web.rest.UserJWTController;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

public final class TenantAssistance {

    private TenantAssistance() {
    }

    public static String resolveCurrentTenantIdentifier() {
        return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
            .filter(authentication -> authentication instanceof UserJWTController.JWTToken)
            .map(authentication -> (UserJWTController.JWTToken) authentication)
            .map(UserJWTController.JWTToken::getIdToken)
            .orElseThrow(() -> new UnknownTenantException("Tenant is empty"));
    }
}
