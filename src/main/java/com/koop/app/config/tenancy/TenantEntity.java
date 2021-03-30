package com.koop.app.config.tenancy;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

@MappedSuperclass
@FilterDef(
    name = TenantEntity.TENANT_FILTER_NAME,
    parameters = @ParamDef(name = TenantEntity.TENANT_FILTER_ARGUMENT_NAME, type = "long"),
    defaultCondition = TenantEntity.TENANT_ID_PROPERTY_NAME + "= :" + TenantEntity.TENANT_FILTER_ARGUMENT_NAME
)
@Filter(name = TenantEntity.TENANT_FILTER_NAME)
public class TenantEntity {

    static final String TENANT_FILTER_NAME = "tenantFilter";
    static final String TENANT_ID_PROPERTY_NAME = "tenant_id";
    static final String TENANT_FILTER_ARGUMENT_NAME = "tenantId";

    @Column(name = TENANT_ID_PROPERTY_NAME, nullable = false)
    Long tenantId;

    public Long getTenantId() {
        return tenantId;
    }

    public void setTenantId(Long tenantId) {
        this.tenantId = tenantId;
    }
}
