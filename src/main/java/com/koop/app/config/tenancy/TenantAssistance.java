package com.koop.app.config.tenancy;

import com.koop.app.security.CurrentUser;
import org.springframework.security.core.context.SecurityContextHolder;

public final class TenantAssistance {

    private TenantAssistance() {
    }

    public static String resolveCurrentTenantIdentifier() {
        if (SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof CurrentUser) {
            CurrentUser authentication = (CurrentUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (authentication != null) {
                String name = authentication.getTenant();
                if (name != null)
                    return name;
            }
        } else {
            return SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        }

        throw new UnknownTenantException("Tenant is empty");
    }
}
