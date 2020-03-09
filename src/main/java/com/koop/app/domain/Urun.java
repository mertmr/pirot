package com.koop.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.koop.app.domain.enumeration.Birim;
import com.koop.app.domain.enumeration.UrunKategorisi;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Urun.
 */
@Entity
@Table(name = "urun")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Urun implements Serializable {
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
    @JsonIgnoreProperties("uruns")
    private User urunSorumlusu;

    @ManyToOne
    @JsonIgnoreProperties("uruns")
    private KdvKategorisi kdvKategorisi;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUrunAdi() {
        return urunAdi;
    }

    public Urun urunAdi(String urunAdi) {
        this.urunAdi = urunAdi;
        return this;
    }

    public void setUrunAdi(String urunAdi) {
        this.urunAdi = urunAdi;
    }

    public BigDecimal getStok() {
        return stok;
    }

    public Urun stok(BigDecimal stok) {
        this.stok = stok;
        return this;
    }

    public void setStok(BigDecimal stok) {
        this.stok = stok;
    }

    public BigDecimal getStokSiniri() {
        return stokSiniri;
    }

    public Urun stokSiniri(BigDecimal stokSiniri) {
        this.stokSiniri = stokSiniri;
        return this;
    }

    public void setStokSiniri(BigDecimal stokSiniri) {
        this.stokSiniri = stokSiniri;
    }

    public BigDecimal getMusteriFiyati() {
        return musteriFiyati;
    }

    public Urun musteriFiyati(BigDecimal musteriFiyati) {
        this.musteriFiyati = musteriFiyati;
        return this;
    }

    public void setMusteriFiyati(BigDecimal musteriFiyati) {
        this.musteriFiyati = musteriFiyati;
    }

    public Birim getBirim() {
        return birim;
    }

    public Urun birim(Birim birim) {
        this.birim = birim;
        return this;
    }

    public void setBirim(Birim birim) {
        this.birim = birim;
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

    public Urun urunKategorisi(UrunKategorisi urunKategorisi) {
        this.urunKategorisi = urunKategorisi;
        return this;
    }

    public void setUrunKategorisi(UrunKategorisi urunKategorisi) {
        this.urunKategorisi = urunKategorisi;
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

    public Urun urunSorumlusu(User user) {
        this.urunSorumlusu = user;
        return this;
    }

    public void setUrunSorumlusu(User user) {
        this.urunSorumlusu = user;
    }

    public KdvKategorisi getKdvKategorisi() {
        return kdvKategorisi;
    }

    public Urun kdvKategorisi(KdvKategorisi kdvKategorisi) {
        this.kdvKategorisi = kdvKategorisi;
        return this;
    }

    public void setKdvKategorisi(KdvKategorisi kdvKategorisi) {
        this.kdvKategorisi = kdvKategorisi;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

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
            "}";
    }
}
