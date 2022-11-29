package com.koop.app.domain;

import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.NotNull;

import com.koop.app.config.tenancy.TenantEntity;
import com.koop.app.domain.enumeration.FaturaTipi;
import com.koop.app.domain.enumeration.GiderTipi;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A UrunFiyatHesap.
 */
@Entity
@Table(name = "urun_fiyat_hesap")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class UrunFiyatHesap extends TenantEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "fatura_tipi")
    private FaturaTipi faturaTipi;

    @Column(name = "amortisman")
    private Integer amortisman;

    @Column(name = "gider_pusula_mustahsil")
    private Integer giderPusulaMustahsil;

    @Column(name = "dukkan_gider")
    private Integer dukkanGider;

    @Column(name = "kooperatif_calisma")
    private Integer kooperatifCalisma;

    @Column(name = "dayanisma")
    private Integer dayanisma;

    @Column(name = "fire")
    private Integer fire;

    @OneToOne
    @JoinColumn(unique = true)
    private Urun urun;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getAmortisman() {
        return amortisman;
    }

    public UrunFiyatHesap amortisman(Integer amortisman) {
        this.amortisman = amortisman;
        return this;
    }

    public void setAmortisman(Integer amortisman) {
        this.amortisman = amortisman;
    }

    public Integer getGiderPusulaMustahsil() {
        return giderPusulaMustahsil;
    }

    public UrunFiyatHesap giderPusulaMustahsil(Integer giderPusulaMustahsil) {
        this.giderPusulaMustahsil = giderPusulaMustahsil;
        return this;
    }

    public void setGiderPusulaMustahsil(Integer giderPusulaMustahsil) {
        this.giderPusulaMustahsil = giderPusulaMustahsil;
    }

    public Integer getDukkanGider() {
        return dukkanGider;
    }

    public UrunFiyatHesap dukkanGider(Integer dukkanGider) {
        this.dukkanGider = dukkanGider;
        return this;
    }

    public void setDukkanGider(Integer dukkanGider) {
        this.dukkanGider = dukkanGider;
    }

    public Integer getKooperatifCalisma() {
        return kooperatifCalisma;
    }

    public UrunFiyatHesap kooperatifCalisma(Integer kooperatifCalisma) {
        this.kooperatifCalisma = kooperatifCalisma;
        return this;
    }

    public void setKooperatifCalisma(Integer kooperatifCalisma) {
        this.kooperatifCalisma = kooperatifCalisma;
    }

    public Integer getDayanisma() {
        return dayanisma;
    }

    public UrunFiyatHesap dayanisma(Integer dayanisma) {
        this.dayanisma = dayanisma;
        return this;
    }

    public void setDayanisma(Integer dayanisma) {
        this.dayanisma = dayanisma;
    }

    public Integer getFire() {
        return fire;
    }

    public UrunFiyatHesap fire(Integer fire) {
        this.fire = fire;
        return this;
    }

    public void setFire(Integer fire) {
        this.fire = fire;
    }

    public Urun getUrun() {
        return urun;
    }

    public UrunFiyatHesap urun(Urun urun) {
        this.urun = urun;
        return this;
    }

    public void setUrun(Urun urun) {
        this.urun = urun;
    }

    public FaturaTipi getFaturaTipi() {
        return faturaTipi;
    }

    public void setFaturaTipi(FaturaTipi faturaTipi) {
        this.faturaTipi = faturaTipi;
    }
// jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UrunFiyatHesap)) {
            return false;
        }
        return id != null && id.equals(((UrunFiyatHesap) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UrunFiyatHesap{" +
            "id=" + getId() +
            ", faturaTipi=" + getFaturaTipi() +
            ", amortisman=" + getAmortisman() +
            ", giderPusulaMustahsil=" + getGiderPusulaMustahsil() +
            ", dukkanGider=" + getDukkanGider() +
            ", kooperatifCalisma=" + getKooperatifCalisma() +
            ", dayanisma=" + getDayanisma() +
            ", fire=" + getFire() +
            "}";
    }
}
