package com.koop.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.ZonedDateTime;

import com.koop.app.domain.enumeration.StokHareketiTipi;

/**
 * A StokGirisi.
 */
@Entity
@Table(name = "stok_girisi")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class StokGirisi implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "miktar", nullable = false)
    private Integer miktar;

    @Column(name = "agirlik")
    private Integer agirlik;

    @NotNull
    @Column(name = "notlar", nullable = false)
    private String notlar;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "stok_hareketi_tipi", nullable = false)
    private StokHareketiTipi stokHareketiTipi;

    @Column(name = "tarih")
    private ZonedDateTime tarih;

    @ManyToOne
    @JsonIgnoreProperties("stokGirisis")
    private User user;

    @ManyToOne
    @JsonIgnoreProperties("stokGirisis")
    private Urun urun;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getMiktar() {
        return miktar;
    }

    public StokGirisi miktar(Integer miktar) {
        this.miktar = miktar;
        return this;
    }

    public void setMiktar(Integer miktar) {
        this.miktar = miktar;
    }

    public Integer getAgirlik() {
        return agirlik;
    }

    public StokGirisi agirlik(Integer agirlik) {
        this.agirlik = agirlik;
        return this;
    }

    public void setAgirlik(Integer agirlik) {
        this.agirlik = agirlik;
    }

    public String getNotlar() {
        return notlar;
    }

    public StokGirisi notlar(String notlar) {
        this.notlar = notlar;
        return this;
    }

    public void setNotlar(String notlar) {
        this.notlar = notlar;
    }

    public StokHareketiTipi getStokHareketiTipi() {
        return stokHareketiTipi;
    }

    public StokGirisi stokHareketiTipi(StokHareketiTipi stokHareketiTipi) {
        this.stokHareketiTipi = stokHareketiTipi;
        return this;
    }

    public void setStokHareketiTipi(StokHareketiTipi stokHareketiTipi) {
        this.stokHareketiTipi = stokHareketiTipi;
    }

    public ZonedDateTime getTarih() {
        return tarih;
    }

    public StokGirisi tarih(ZonedDateTime tarih) {
        this.tarih = tarih;
        return this;
    }

    public void setTarih(ZonedDateTime tarih) {
        this.tarih = tarih;
    }

    public User getUser() {
        return user;
    }

    public StokGirisi user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Urun getUrun() {
        return urun;
    }

    public StokGirisi urun(Urun urun) {
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
        if (!(o instanceof StokGirisi)) {
            return false;
        }
        return id != null && id.equals(((StokGirisi) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "StokGirisi{" +
            "id=" + getId() +
            ", miktar=" + getMiktar() +
            ", agirlik=" + getAgirlik() +
            ", notlar='" + getNotlar() + "'" +
            ", stokHareketiTipi='" + getStokHareketiTipi() + "'" +
            ", tarih='" + getTarih() + "'" +
            "}";
    }
}
