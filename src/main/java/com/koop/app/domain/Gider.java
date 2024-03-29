package com.koop.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.koop.app.config.tenancy.TenantEntity;
import com.koop.app.domain.enumeration.GiderTipi;
import com.koop.app.domain.enumeration.OdemeAraci;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Objects;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Gider.
 */
@Entity
@Table(name = "gider")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Gider extends TenantEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "tarih")
    private ZonedDateTime tarih;

    @NotNull
    @Column(name = "tutar", precision = 21, scale = 2, nullable = false)
    private BigDecimal tutar;

    @NotNull
    @Column(name = "notlar", nullable = false)
    private String notlar;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "gider_tipi", nullable = false)
    private GiderTipi giderTipi;

    @Enumerated(EnumType.STRING)
    @Column(name = "odeme_araci")
    private OdemeAraci odemeAraci;

    @ManyToOne
    @JsonIgnoreProperties(value = "giders", allowSetters = true)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getTarih() {
        return tarih;
    }

    public Gider tarih(ZonedDateTime tarih) {
        this.tarih = tarih;
        return this;
    }

    public void setTarih(ZonedDateTime tarih) {
        this.tarih = tarih;
    }

    public BigDecimal getTutar() {
        return tutar;
    }

    public Gider tutar(BigDecimal tutar) {
        this.tutar = tutar;
        return this;
    }

    public void setTutar(BigDecimal tutar) {
        this.tutar = tutar;
    }

    public String getNotlar() {
        return notlar;
    }

    public Gider notlar(String notlar) {
        this.notlar = notlar;
        return this;
    }

    public void setNotlar(String notlar) {
        this.notlar = notlar;
    }

    public GiderTipi getGiderTipi() {
        return giderTipi;
    }

    public Gider giderTipi(GiderTipi giderTipi) {
        this.giderTipi = giderTipi;
        return this;
    }

    public void setGiderTipi(GiderTipi giderTipi) {
        this.giderTipi = giderTipi;
    }

    public OdemeAraci getOdemeAraci() {
        return odemeAraci;
    }

    public Gider odemeAraci(OdemeAraci odemeAraci) {
        this.odemeAraci = odemeAraci;
        return this;
    }

    public void setOdemeAraci(OdemeAraci odemeAraci) {
        this.odemeAraci = odemeAraci;
    }

    public User getUser() {
        return user;
    }

    public Gider user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Gider)) {
            return false;
        }
        return id != null && id.equals(((Gider) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return (
            "Gider{" +
            "id=" +
            getId() +
            ", tarih='" +
            getTarih() +
            "'" +
            ", tutar=" +
            getTutar() +
            ", notlar='" +
            getNotlar() +
            "'" +
            ", giderTipi='" +
            getGiderTipi() +
            "'" +
            ", odemeAraci='" +
            getOdemeAraci() +
            "'" +
            "}"
        );
    }
}
