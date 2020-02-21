package com.koop.app.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.time.ZonedDateTime;

/**
 * A Kisiler.
 */
@Entity
@Table(name = "kisiler")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Kisiler implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "kisi_adi")
    private String kisiAdi;

    @Column(name = "notlar")
    private String notlar;

    @Column(name = "tarih")
    private ZonedDateTime tarih;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getKisiAdi() {
        return kisiAdi;
    }

    public Kisiler kisiAdi(String kisiAdi) {
        this.kisiAdi = kisiAdi;
        return this;
    }

    public void setKisiAdi(String kisiAdi) {
        this.kisiAdi = kisiAdi;
    }

    public String getNotlar() {
        return notlar;
    }

    public Kisiler notlar(String notlar) {
        this.notlar = notlar;
        return this;
    }

    public void setNotlar(String notlar) {
        this.notlar = notlar;
    }

    public ZonedDateTime getTarih() {
        return tarih;
    }

    public Kisiler tarih(ZonedDateTime tarih) {
        this.tarih = tarih;
        return this;
    }

    public void setTarih(ZonedDateTime tarih) {
        this.tarih = tarih;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Kisiler)) {
            return false;
        }
        return id != null && id.equals(((Kisiler) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Kisiler{" +
            "id=" + getId() +
            ", kisiAdi='" + getKisiAdi() + "'" +
            ", notlar='" + getNotlar() + "'" +
            ", tarih='" + getTarih() + "'" +
            "}";
    }
}
