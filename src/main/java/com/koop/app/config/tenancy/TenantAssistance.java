package com.koop.app.config.tenancy;

import com.koop.app.security.CurrentUser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;

public final class TenantAssistance {

    private static final Logger log = LoggerFactory.getLogger(TenantAssistance.class);

    private TenantAssistance() {}

    public static Long resolveCurrentTenantIdentifier() {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            return null;
        } else if (SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof CurrentUser) {
            CurrentUser authentication = (CurrentUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (authentication != null) {
                Long tenant = authentication.getTenant();
                if (tenant != null) return tenant;

                log.error(tenant.toString());
            }
        } else {
            return null;
        }

        throw new UnknownTenantException("Tenant is empty");
    }
}
