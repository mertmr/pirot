package com.koop.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.koop.app.config.tenancy.TenantEntity;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.ZonedDateTime;

/**
 * A UreticiOdemeleri.
 */
@Entity
@Table(name = "uretici_odemeleri")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class UreticiOdemeleri extends TenantEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "tutar", precision = 21, scale = 2)
    private BigDecimal tutar;

    @Column(name = "son_guncellenme_tarihi")
    private ZonedDateTime sonGuncellenmeTarihi;

    @ManyToOne
    @JsonIgnoreProperties(value = "ureticiOdemeleris", allowSetters = true)
    private Uretici uretici;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getTutar() {
        return tutar;
    }

    public UreticiOdemeleri tutar(BigDecimal tutar) {
        this.tutar = tutar;
        return this;
    }

    public void setTutar(BigDecimal tutar) {
        this.tutar = tutar;
    }

    public ZonedDateTime getSonGuncellenmeTarihi() {
        return sonGuncellenmeTarihi;
    }

    public UreticiOdemeleri sonGuncellenmeTarihi(ZonedDateTime sonGuncellenmeTarihi) {
        this.sonGuncellenmeTarihi = sonGuncellenmeTarihi;
        return this;
    }

    public void setSonGuncellenmeTarihi(ZonedDateTime sonGuncellenmeTarihi) {
        this.sonGuncellenmeTarihi = sonGuncellenmeTarihi;
    }

    public Uretici getUretici() {
        return uretici;
    }

    public UreticiOdemeleri uretici(Uretici uretici) {
        this.uretici = uretici;
        return this;
    }

    public void setUretici(Uretici uretici) {
        this.uretici = uretici;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UreticiOdemeleri)) {
            return false;
        }
        return id != null && id.equals(((UreticiOdemeleri) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UreticiOdemeleri{" +
            "id=" + getId() +
            ", tutar=" + getTutar() +
            ", sonGuncellenmeTarihi='" + getSonGuncellenmeTarihi() + "'" +
            "}";
    }
}
