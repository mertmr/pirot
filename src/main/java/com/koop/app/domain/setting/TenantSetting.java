package com.koop.app.domain.setting;

import com.koop.app.config.tenancy.TenantEntity;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "tenant_setting")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class TenantSetting extends TenantEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "tenant_id")
    private Long tenantId;

    @Column(name = "setting_id")
    private Long settingId;

    @Column(name = "allowed_setting_value_id")
    private Long allowedSettingValueId;

    @Column(name = "unconstrained_value")
    private Long unconstrainedValue;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public Long getTenantId() {
        return tenantId;
    }

    @Override
    public void setTenantId(Long tenantId) {
        this.tenantId = tenantId;
    }

    public Long getSettingId() {
        return settingId;
    }

    public void setSettingId(Long settingId) {
        this.settingId = settingId;
    }

    public Long getAllowedSettingValueId() {
        return allowedSettingValueId;
    }

    public void setAllowedSettingValueId(Long allowedSettingValueId) {
        this.allowedSettingValueId = allowedSettingValueId;
    }

    public Long getUnconstrainedValue() {
        return unconstrainedValue;
    }

    public void setUnconstrainedValue(Long unconstrainedValue) {
        this.unconstrainedValue = unconstrainedValue;
    }
}
