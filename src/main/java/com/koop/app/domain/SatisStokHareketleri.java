package com.koop.app.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * A SatisStokHareketleri.
 */
@Entity
@Table(name = "satis_stok_hareketleri")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class SatisStokHareketleri implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "miktar", nullable = false)
    private Integer miktar;

    @NotNull
    @Column(name = "tutar", precision = 21, scale = 2, nullable = false)
    private BigDecimal tutar;

    @ManyToOne
    @JsonIgnoreProperties("satisStokHareketleris")
    private Urun urun;

    @ManyToOne
    @JsonIgnoreProperties("stokHareketleriLists")
    private Satis satis;

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

    public SatisStokHareketleri miktar(Integer miktar) {
        this.miktar = miktar;
        return this;
    }

    public void setMiktar(Integer miktar) {
        this.miktar = miktar;
    }

    public BigDecimal getTutar() {
        return tutar;
    }

    public SatisStokHareketleri tutar(BigDecimal tutar) {
        this.tutar = tutar;
        return this;
    }

    public void setTutar(BigDecimal tutar) {
        this.tutar = tutar;
    }

    public Urun getUrun() {
        return urun;
    }

    public SatisStokHareketleri urun(Urun urun) {
        this.urun = urun;
        return this;
    }

    public void setUrun(Urun urun) {
        this.urun = urun;
    }

    public Satis getSatis() {
        return satis;
    }

    public SatisStokHareketleri satis(Satis satis) {
        this.satis = satis;
        return this;
    }

    public void setSatis(Satis satis) {
        this.satis = satis;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SatisStokHareketleri)) {
            return false;
        }
        return id != null && id.equals(((SatisStokHareketleri) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "SatisStokHareketleri{" +
            "id=" + getId() +
            ", miktar=" + getMiktar() +
            ", tutar=" + getTutar() +
            "}";
    }
}
