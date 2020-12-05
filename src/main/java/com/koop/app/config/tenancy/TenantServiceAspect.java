package com.koop.app.config.tenancy;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.hibernate.Filter;
import org.hibernate.Session;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;

import static com.koop.app.config.tenancy.TenantEntity.TENANT_FILTER_ARGUMENT_NAME;
import static com.koop.app.config.tenancy.TenantEntity.TENANT_FILTER_NAME;

@Aspect
@Component
public class TenantServiceAspect {

    private final EntityManager entityManager;

    public TenantServiceAspect(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Pointcut("execution(public * org.springframework.data.repository.Repository+.*(..))")
    void isRepository() {
        /* aspect */
    }

    @Pointcut(value = "isRepository()")
    void enableMultiTenancy() {
        /* aspect */
    }

    @Around("execution(public * *(..)) && enableMultiTenancy()")
    public Object aroundExecution(final ProceedingJoinPoint pjp) throws Throwable {
        final Filter filter =
            this.entityManager
                .unwrap(Session.class) // requires transaction
                .enableFilter(TENANT_FILTER_NAME)
                .setParameter(
                    TENANT_FILTER_ARGUMENT_NAME, TenantAssistance.resolveCurrentTenantIdentifier());
        filter.validate();
        return pjp.proceed();
    }
}
