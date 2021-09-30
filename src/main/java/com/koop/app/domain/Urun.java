package com.koop.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.koop.app.config.tenancy.TenantEntity;
import com.koop.app.domain.enumeration.Birim;
import com.koop.app.domain.enumeration.UrunKategorisi;
import java.io.Serializable;
import java.math.BigDecimal;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Urun.
 */
@Entity
@Table(name = "urun")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Urun extends TenantEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "urun_adi", nullable = false)
    private String urunAdi;

    @Column(name = "stok", precision = 21, scale = 2)
    private BigDecimal stok;

    @Column(name = "stok_siniri", precision = 21, scale = 2)
    private BigDecimal stokSiniri;

    @Column(name = "musteri_fiyati", precision = 21, scale = 2)
    private BigDecimal musteriFiyati;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "birim", nullable = false)
    private Birim birim;

    @Column(name = "dayanisma_urunu")
    private Boolean dayanismaUrunu;

    @Column(name = "satista")
    private Boolean satista;

    @Enumerated(EnumType.STRING)
    @Column(name = "urun_kategorisi")
    private UrunKategorisi urunKategorisi;

    @Column(name = "active")
    private Boolean active;

    @ManyToOne
    @JsonIgnoreProperties(value = "uruns", allowSetters = true)
    private User urunSorumlusu;

    @ManyToOne
    @JsonIgnoreProperties(value = "uruns", allowSetters = true)
    private KdvKategorisi kdvKategorisi;

    @OneToOne(mappedBy = "urun")
    @JsonIgnore
    private UrunFiyatHesap urunFiyatHesap;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUrunAdi() {
        return urunAdi;
    }

    public void setUrunAdi(String urunAdi) {
        this.urunAdi = urunAdi;
    }

    public Urun urunAdi(String urunAdi) {
        this.urunAdi = urunAdi;
        return this;
    }

    public BigDecimal getStok() {
        return stok;
    }

    public void setStok(BigDecimal stok) {
        this.stok = stok;
    }

    public Urun stok(BigDecimal stok) {
        this.stok = stok;
        return this;
    }

    public BigDecimal getStokSiniri() {
        return stokSiniri;
    }

    public void setStokSiniri(BigDecimal stokSiniri) {
        this.stokSiniri = stokSiniri;
    }

    public Urun stokSiniri(BigDecimal stokSiniri) {
        this.stokSiniri = stokSiniri;
        return this;
    }

    public BigDecimal getMusteriFiyati() {
        return musteriFiyati;
    }

    public void setMusteriFiyati(BigDecimal musteriFiyati) {
        this.musteriFiyati = musteriFiyati;
    }

    public Urun musteriFiyati(BigDecimal musteriFiyati) {
        this.musteriFiyati = musteriFiyati;
        return this;
    }

    public Birim getBirim() {
        return birim;
    }

    public void setBirim(Birim birim) {
        this.birim = birim;
    }

    public Urun birim(Birim birim) {
        this.birim = birim;
        return this;
    }

    public Boolean isDayanismaUrunu() {
        return dayanismaUrunu;
    }

    public Urun dayanismaUrunu(Boolean dayanismaUrunu) {
        this.dayanismaUrunu = dayanismaUrunu;
        return this;
    }

    public void setDayanismaUrunu(Boolean dayanismaUrunu) {
        this.dayanismaUrunu = dayanismaUrunu;
    }

    public Boolean isSatista() {
        return satista;
    }

    public Urun satista(Boolean satista) {
        this.satista = satista;
        return this;
    }

    public void setSatista(Boolean satista) {
        this.satista = satista;
    }

    public UrunKategorisi getUrunKategorisi() {
        return urunKategorisi;
    }

    public void setUrunKategorisi(UrunKategorisi urunKategorisi) {
        this.urunKategorisi = urunKategorisi;
    }

    public Urun urunKategorisi(UrunKategorisi urunKategorisi) {
        this.urunKategorisi = urunKategorisi;
        return this;
    }

    public Boolean isActive() {
        return active;
    }

    public Urun active(Boolean active) {
        this.active = active;
        return this;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public User getUrunSorumlusu() {
        return urunSorumlusu;
    }

    public void setUrunSorumlusu(User user) {
        this.urunSorumlusu = user;
    }

    public Urun urunSorumlusu(User user) {
        this.urunSorumlusu = user;
        return this;
    }

    public KdvKategorisi getKdvKategorisi() {
        return kdvKategorisi;
    }

    public void setKdvKategorisi(KdvKategorisi kdvKategorisi) {
        this.kdvKategorisi = kdvKategorisi;
    }

    public Urun kdvKategorisi(KdvKategorisi kdvKategorisi) {
        this.kdvKategorisi = kdvKategorisi;
        return this;
    }

    public UrunFiyatHesap getUrunFiyatHesap() {
        return urunFiyatHesap;
    }

    public void setUrunFiyatHesap(UrunFiyatHesap urunFiyatHesap) {
        this.urunFiyatHesap = urunFiyatHesap;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Urun)) {
            return false;
        }
        return id != null && id.equals(((Urun) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Urun{" +
            "id=" + getId() +
            ", urunAdi='" + getUrunAdi() + "'" +
            ", stok=" + getStok() +
            ", stokSiniri=" + getStokSiniri() +
            ", musteriFiyati=" + getMusteriFiyati() +
            ", birim='" + getBirim() + "'" +
            ", dayanismaUrunu='" + isDayanismaUrunu() + "'" +
            ", satista='" + isSatista() + "'" +
            ", urunKategorisi='" + getUrunKategorisi() + "'" +
            ", active='" + isActive() + "'" +
            "}";
    }
}
