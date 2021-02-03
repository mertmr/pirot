package com.koop.app.config.tenancy;

import com.koop.app.security.CurrentUser;
import org.springframework.security.core.context.SecurityContextHolder;

public final class TenantAssistance {

    private TenantAssistance() {
    }

    public static Long resolveCurrentTenantIdentifier() {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            return null;
        } else if (SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof CurrentUser) {
            CurrentUser authentication = (CurrentUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (authentication != null) {
                Long tenant = authentication.getTenant();
                if (tenant != null)
                    return tenant;
            }
        } else {
            return 0L;
        }

        throw new UnknownTenantException("Tenant is empty");
    }
}
