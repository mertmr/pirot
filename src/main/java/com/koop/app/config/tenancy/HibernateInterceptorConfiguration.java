package com.koop.app.config.tenancy;

import org.hibernate.EmptyInterceptor;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class HibernateInterceptorConfiguration implements HibernatePropertiesCustomizer {

    private final EmptyInterceptor tenantInterceptor;

    public HibernateInterceptorConfiguration(EmptyInterceptor tenantInterceptor) {
        this.tenantInterceptor = tenantInterceptor;
    }

    @Override
    public void customize(final Map<String, Object> hibernateProperties) {
        hibernateProperties.put("hibernate.session_factory.interceptor", this.tenantInterceptor);
    }
}
