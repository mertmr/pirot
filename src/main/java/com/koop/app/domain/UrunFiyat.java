package com.koop.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;
import java.math.BigDecimal;
import java.time.ZonedDateTime;

/**
 * A UrunFiyat.
 */
@Entity
@Table(name = "urun_fiyat")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class UrunFiyat implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "fiyat", precision = 21, scale = 2)
    private BigDecimal fiyat;

    @Column(name = "tarih")
    private ZonedDateTime tarih;

    @ManyToOne
    @JsonIgnoreProperties("urunFiyats")
    private User user;

    @ManyToOne
    @JsonIgnoreProperties("urunFiyats")
    private Urun urun;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getFiyat() {
        return fiyat;
    }

    public UrunFiyat fiyat(BigDecimal fiyat) {
        this.fiyat = fiyat;
        return this;
    }

    public void setFiyat(BigDecimal fiyat) {
        this.fiyat = fiyat;
    }

    public ZonedDateTime getTarih() {
        return tarih;
    }

    public UrunFiyat tarih(ZonedDateTime tarih) {
        this.tarih = tarih;
        return this;
    }

    public void setTarih(ZonedDateTime tarih) {
        this.tarih = tarih;
    }

    public User getUser() {
        return user;
    }

    public UrunFiyat user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Urun getUrun() {
        return urun;
    }

    public UrunFiyat urun(Urun urun) {
        this.urun = urun;
        return this;
    }

    public void setUrun(Urun urun) {
        this.urun = urun;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UrunFiyat)) {
            return false;
        }
        return id != null && id.equals(((UrunFiyat) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "UrunFiyat{" +
            "id=" + getId() +
            ", fiyat=" + getFiyat() +
            ", tarih='" + getTarih() + "'" +
            "}";
    }
}
