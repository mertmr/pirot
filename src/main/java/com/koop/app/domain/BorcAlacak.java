package com.koop.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.koop.app.domain.enumeration.HareketTipi;
import com.koop.app.domain.enumeration.OdemeAraci;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Objects;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A BorcAlacak.
 */
@Entity
@Table(name = "borc_alacak")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class BorcAlacak implements Serializable {
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
    @JsonIgnoreProperties(value = "borcAlacaks", allowSetters = true)
    private User user;

    @ManyToOne
    @JsonIgnoreProperties(value = "borcAlacaks", allowSetters = true)
    private Urun urun;

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

    public BorcAlacak tutar(BigDecimal tutar) {
        this.tutar = tutar;
        return this;
    }

    public void setTutar(BigDecimal tutar) {
        this.tutar = tutar;
    }

    public String getNotlar() {
        return notlar;
    }

    public BorcAlacak notlar(String notlar) {
        this.notlar = notlar;
        return this;
    }

    public void setNotlar(String notlar) {
        this.notlar = notlar;
    }

    public OdemeAraci getOdemeAraci() {
        return odemeAraci;
    }

    public BorcAlacak odemeAraci(OdemeAraci odemeAraci) {
        this.odemeAraci = odemeAraci;
        return this;
    }

    public void setOdemeAraci(OdemeAraci odemeAraci) {
        this.odemeAraci = odemeAraci;
    }

    public HareketTipi getHareketTipi() {
        return hareketTipi;
    }

    public BorcAlacak hareketTipi(HareketTipi hareketTipi) {
        this.hareketTipi = hareketTipi;
        return this;
    }

    public void setHareketTipi(HareketTipi hareketTipi) {
        this.hareketTipi = hareketTipi;
    }

    public ZonedDateTime getTarih() {
        return tarih;
    }

    public BorcAlacak tarih(ZonedDateTime tarih) {
        this.tarih = tarih;
        return this;
    }

    public void setTarih(ZonedDateTime tarih) {
        this.tarih = tarih;
    }

    public User getUser() {
        return user;
    }

    public BorcAlacak user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Urun getUrun() {
        return urun;
    }

    public BorcAlacak urun(Urun urun) {
        this.urun = urun;
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
        return 31;
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
