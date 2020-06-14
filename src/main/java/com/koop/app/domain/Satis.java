package com.koop.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * A Satis.
 */
@Entity
@Table(name = "satis")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Satis implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "tarih")
    private ZonedDateTime tarih;

    @Column(name = "toplam_tutar", precision = 21, scale = 2)
    private BigDecimal toplamTutar;

    @Column(name = "ortaga_satis")
    private Boolean ortagaSatis;

    @Column(name = "kartli_satis")
    private Boolean kartliSatis;

    @OneToMany(mappedBy = "satis")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<SatisStokHareketleri> stokHareketleriLists = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties("satis")
    private User user;

    @ManyToOne
    @JsonIgnoreProperties("satis")
    private Kisiler kisi;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getTarih() {
        return tarih;
    }

    public Satis tarih(ZonedDateTime tarih) {
        this.tarih = tarih;
        return this;
    }

    public void setTarih(ZonedDateTime tarih) {
        this.tarih = tarih;
    }

    public BigDecimal getToplamTutar() {
        return toplamTutar;
    }

    public Satis toplamTutar(BigDecimal toplamTutar) {
        this.toplamTutar = toplamTutar;
        return this;
    }

    public void setToplamTutar(BigDecimal toplamTutar) {
        this.toplamTutar = toplamTutar;
    }

    public Boolean isOrtagaSatis() {
        return ortagaSatis;
    }

    public Satis ortagaSatis(Boolean ortagaSatis) {
        this.ortagaSatis = ortagaSatis;
        return this;
    }

    public void setOrtagaSatis(Boolean ortagaSatis) {
        this.ortagaSatis = ortagaSatis;
    }

    public Boolean isKartliSatis() {
        return kartliSatis;
    }

    public Satis kartliSatis(Boolean kartliSatis) {
        this.kartliSatis = kartliSatis;
        return this;
    }

    public void setKartliSatis(Boolean kartliSatis) {
        this.kartliSatis = kartliSatis;
    }

    public Set<SatisStokHareketleri> getStokHareketleriLists() {
        return stokHareketleriLists;
    }

    public Satis stokHareketleriLists(Set<SatisStokHareketleri> satisStokHareketleris) {
        this.stokHareketleriLists = satisStokHareketleris;
        return this;
    }

    public Satis addStokHareketleriList(SatisStokHareketleri satisStokHareketleri) {
        this.stokHareketleriLists.add(satisStokHareketleri);
        satisStokHareketleri.setSatis(this);
        return this;
    }

    public Satis removeStokHareketleriList(SatisStokHareketleri satisStokHareketleri) {
        this.stokHareketleriLists.remove(satisStokHareketleri);
        satisStokHareketleri.setSatis(null);
        return this;
    }

    public void setStokHareketleriLists(Set<SatisStokHareketleri> satisStokHareketleris) {
        this.stokHareketleriLists = satisStokHareketleris;
    }

    public User getUser() {
        return user;
    }

    public Satis user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Kisiler getKisi() {
        return kisi;
    }

    public Satis kisi(Kisiler kisiler) {
        this.kisi = kisiler;
        return this;
    }

    public void setKisi(Kisiler kisiler) {
        this.kisi = kisiler;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Satis)) {
            return false;
        }
        return id != null && id.equals(((Satis) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Satis{" +
            "id=" + getId() +
            ", tarih='" + getTarih() + "'" +
            ", toplamTutar=" + getToplamTutar() +
            ", ortagaSatis='" + isOrtagaSatis() + "'" +
            ", kartliSatis='" + isKartliSatis() + "'" +
            "}";
    }
}
