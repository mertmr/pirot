package com.koop.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.koop.app.config.tenancy.TenantEntity;
import com.koop.app.domain.enumeration.HareketTipi;
import com.koop.app.domain.enumeration.OdemeAraci;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A BorcAlacak.
 */
@Entity
@Table(name = "borc_alacak")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class BorcAlacak extends TenantEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "tutar", precision = 21, scale = 2)
    private BigDecimal tutar;

    @Column(name = "notlar")
    private String notlar;

    @Enumerated(EnumType.STRING)
    @Column(name = "odeme_araci")
    private OdemeAraci odemeAraci;

    @Enumerated(EnumType.STRING)
    @Column(name = "hareket_tipi")
    private HareketTipi hareketTipi;

    @Column(name = "tarih")
    private ZonedDateTime tarih;

    @ManyToOne
    private User user;

    @ManyToOne
    @JsonIgnoreProperties(value = { "urunSorumlusu", "kdvKategorisi", "urunFiyatHesap" }, allowSetters = true)
    private Urun urun;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BorcAlacak id(Long id) {
        this.id = id;
        return this;
    }

    public BigDecimal getTutar() {
        return this.tutar;
    }

    public BorcAlacak tutar(BigDecimal tutar) {
        this.tutar = tutar;
        return this;
    }

    public void setTutar(BigDecimal tutar) {
        this.tutar = tutar;
    }

    public String getNotlar() {
        return this.notlar;
    }

    public BorcAlacak notlar(String notlar) {
        this.notlar = notlar;
        return this;
    }

    public void setNotlar(String notlar) {
        this.notlar = notlar;
    }

    public OdemeAraci getOdemeAraci() {
        return this.odemeAraci;
    }

    public BorcAlacak odemeAraci(OdemeAraci odemeAraci) {
        this.odemeAraci = odemeAraci;
        return this;
    }

    public void setOdemeAraci(OdemeAraci odemeAraci) {
        this.odemeAraci = odemeAraci;
    }

    public HareketTipi getHareketTipi() {
        return this.hareketTipi;
    }

    public BorcAlacak hareketTipi(HareketTipi hareketTipi) {
        this.hareketTipi = hareketTipi;
        return this;
    }

    public void setHareketTipi(HareketTipi hareketTipi) {
        this.hareketTipi = hareketTipi;
    }

    public ZonedDateTime getTarih() {
        return this.tarih;
    }

    public BorcAlacak tarih(ZonedDateTime tarih) {
        this.tarih = tarih;
        return this;
    }

    public void setTarih(ZonedDateTime tarih) {
        this.tarih = tarih;
    }

    public User getUser() {
        return this.user;
    }

    public BorcAlacak user(User user) {
        this.setUser(user);
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Urun getUrun() {
        return this.urun;
    }

    public BorcAlacak urun(Urun urun) {
        this.setUrun(urun);
        return this;
    }

    public void setUrun(Urun urun) {
        this.urun = urun;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof BorcAlacak)) {
            return false;
        }
        return id != null && id.equals(((BorcAlacak) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return (
            "BorcAlacak{" +
                "id=" +
                getId() +
                ", tutar=" +
                getTutar() +
                ", notlar='" +
                getNotlar() +
                "'" +
                ", odemeAraci='" +
                getOdemeAraci() +
                "'" +
                ", hareketTipi='" +
                getHareketTipi() +
                "'" +
                ", tarih='" +
                getTarih() +
                "'" +
                "}"
        );
    }
}
