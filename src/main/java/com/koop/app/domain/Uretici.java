package com.koop.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Uretici.
 */
@Entity
@Table(name = "uretici")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Uretici implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "adi", nullable = false)
    private String adi;

    @Column(name = "adres")
    private String adres;

    @NotNull
    @Column(name = "banka_bilgileri", nullable = false)
    private String bankaBilgileri;

    @Column(name = "tarih")
    private ZonedDateTime tarih;

    @ManyToOne
    @JsonIgnoreProperties("ureticis")
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAdi() {
        return adi;
    }

    public Uretici adi(String adi) {
        this.adi = adi;
        return this;
    }

    public void setAdi(String adi) {
        this.adi = adi;
    }

    public String getAdres() {
        return adres;
    }

    public Uretici adres(String adres) {
        this.adres = adres;
        return this;
    }

    public void setAdres(String adres) {
        this.adres = adres;
    }

    public String getBankaBilgileri() {
        return bankaBilgileri;
    }

    public Uretici bankaBilgileri(String bankaBilgileri) {
        this.bankaBilgileri = bankaBilgileri;
        return this;
    }

    public void setBankaBilgileri(String bankaBilgileri) {
        this.bankaBilgileri = bankaBilgileri;
    }

    public ZonedDateTime getTarih() {
        return tarih;
    }

    public Uretici tarih(ZonedDateTime tarih) {
        this.tarih = tarih;
        return this;
    }

    public void setTarih(ZonedDateTime tarih) {
        this.tarih = tarih;
    }

    public User getUser() {
        return user;
    }

    public Uretici user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Uretici)) {
            return false;
        }
        return id != null && id.equals(((Uretici) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return (
            "Uretici{" +
            "id=" +
            getId() +
            ", adi='" +
            getAdi() +
            "'" +
            ", adres='" +
            getAdres() +
            "'" +
            ", bankaBilgileri='" +
            getBankaBilgileri() +
            "'" +
            ", tarih='" +
            getTarih() +
            "'" +
            "}"
        );
    }
}
