package com.koop.app.domain;

import java.io.Serializable;
import java.util.Objects;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A KdvKategorisi.
 */
@Entity
@Table(name = "kdv_kategorisi")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class KdvKategorisi implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "kategori_adi", nullable = false)
    private String kategoriAdi;

    @NotNull
    @Column(name = "kdv_orani", nullable = false)
    private Integer kdvOrani;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getKategoriAdi() {
        return kategoriAdi;
    }

    public KdvKategorisi kategoriAdi(String kategoriAdi) {
        this.kategoriAdi = kategoriAdi;
        return this;
    }

    public void setKategoriAdi(String kategoriAdi) {
        this.kategoriAdi = kategoriAdi;
    }

    public Integer getKdvOrani() {
        return kdvOrani;
    }

    public KdvKategorisi kdvOrani(Integer kdvOrani) {
        this.kdvOrani = kdvOrani;
        return this;
    }

    public void setKdvOrani(Integer kdvOrani) {
        this.kdvOrani = kdvOrani;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof KdvKategorisi)) {
            return false;
        }
        return id != null && id.equals(((KdvKategorisi) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "KdvKategorisi{" + "id=" + getId() + ", kategoriAdi='" + getKategoriAdi() + "'" + ", kdvOrani=" + getKdvOrani() + "}";
    }
}
