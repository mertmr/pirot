package com.koop.app.config.tenancy;

import org.hibernate.EmptyInterceptor;
import org.hibernate.type.Type;

import java.io.Serializable;

import static com.koop.app.config.tenancy.TenantEntity.TENANT_FILTER_ARGUMENT_NAME;

public final class TenantInterceptor extends EmptyInterceptor {

    @Override
    public boolean onSave(
        final Object entity,
        final Serializable id,
        final Object[] state,
        final String[] propertyNames,
        final Type[] types) {
        return this.addTenantIdIfObjectIsTenantEntity(entity, state, propertyNames);
    }

    @Override
    public boolean onFlushDirty(
        final Object entity,
        final Serializable id,
        final Object[] currentState,
        final Object[] previousState,
        final String[] propertyNames,
        final Type[] types) {
        return this.addTenantIdIfObjectIsTenantEntity(entity, currentState, propertyNames);
    }

    @Override
    public void onDelete(
        final Object entity,
        final Serializable id,
        final Object[] state,
        final String[] propertyNames,
        final Type[] types) {
        this.addTenantIdIfObjectIsTenantEntity(entity, state, propertyNames);
    }

    private boolean addTenantIdIfObjectIsTenantEntity(
        Object entity, Object[] state, String[] propertyName) {
        if (entity instanceof TenantEntity) {
            for (int index = 0; index < propertyName.length; index++) {
                if (propertyName[index].equals(TENANT_FILTER_ARGUMENT_NAME)) {
                    Long tenantIdentifier = TenantAssistance.resolveCurrentTenantIdentifier();
                    if(tenantIdentifier == null) {
                        return false;
                    }
                    state[index] = tenantIdentifier;
                    return true;
                }
            }
            throw new ClassCastException();
        }
        return false;
    }
}
