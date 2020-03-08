package com.koop.app.domain;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Objects;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A KasaHareketleri.
 */
@Entity
@Table(name = "kasa_hareketleri")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class KasaHareketleri implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "kasa_miktar", precision = 21, scale = 2)
    private BigDecimal kasaMiktar;

    @Column(name = "hareket")
    private String hareket;

    @Column(name = "tarih")
    private ZonedDateTime tarih;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getKasaMiktar() {
        return kasaMiktar;
    }

    public KasaHareketleri kasaMiktar(BigDecimal kasaMiktar) {
        this.kasaMiktar = kasaMiktar;
        return this;
    }

    public void setKasaMiktar(BigDecimal kasaMiktar) {
        this.kasaMiktar = kasaMiktar;
    }

    public String getHareket() {
        return hareket;
    }

    public KasaHareketleri hareket(String hareket) {
        this.hareket = hareket;
        return this;
    }

    public void setHareket(String hareket) {
        this.hareket = hareket;
    }

    public ZonedDateTime getTarih() {
        return tarih;
    }

    public KasaHareketleri tarih(ZonedDateTime tarih) {
        this.tarih = tarih;
        return this;
    }

    public void setTarih(ZonedDateTime tarih) {
        this.tarih = tarih;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof KasaHareketleri)) {
            return false;
        }
        return id != null && id.equals(((KasaHareketleri) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return (
            "KasaHareketleri{" +
            "id=" +
            getId() +
            ", kasaMiktar=" +
            getKasaMiktar() +
            ", hareket='" +
            getHareket() +
            "'" +
            ", tarih='" +
            getTarih() +
            "'" +
            "}"
        );
    }
}
