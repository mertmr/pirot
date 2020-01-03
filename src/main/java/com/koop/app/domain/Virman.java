package com.koop.app.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.ZonedDateTime;

import com.koop.app.domain.enumeration.Hesap;

/**
 * A Virman.
 */
@Entity
@Table(name = "virman")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Virman implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "tutar", nullable = false)
    private Integer tutar;

    @NotNull
    @Column(name = "notlar", nullable = false)
    private String notlar;

    @NotNull
    @Column(name = "cikis_hesabi", nullable = false)
    private Hesap cikisHesabi;

    @NotNull
    @Column(name = "grisi_hesabi", nullable = false)
    private Hesap grisiHesabi;

    @Column(name = "tarih")
    private ZonedDateTime tarih;

    @ManyToOne
    @JsonIgnoreProperties("virmen")
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getTutar() {
        return tutar;
    }

    public Virman tutar(Integer tutar) {
        this.tutar = tutar;
        return this;
    }

    public void setTutar(Integer tutar) {
        this.tutar = tutar;
    }

    public String getNotlar() {
        return notlar;
    }

    public Virman notlar(String notlar) {
        this.notlar = notlar;
        return this;
    }

    public void setNotlar(String notlar) {
        this.notlar = notlar;
    }

    public Hesap getCikisHesabi() {
        return cikisHesabi;
    }

    public Virman cikisHesabi(Hesap cikisHesabi) {
        this.cikisHesabi = cikisHesabi;
        return this;
    }

    public void setCikisHesabi(Hesap cikisHesabi) {
        this.cikisHesabi = cikisHesabi;
    }

    public Hesap getGrisiHesabi() {
        return grisiHesabi;
    }

    public Virman grisiHesabi(Hesap grisiHesabi) {
        this.grisiHesabi = grisiHesabi;
        return this;
    }

    public void setGrisiHesabi(Hesap grisiHesabi) {
        this.grisiHesabi = grisiHesabi;
    }

    public ZonedDateTime getTarih() {
        return tarih;
    }

    public Virman tarih(ZonedDateTime tarih) {
        this.tarih = tarih;
        return this;
    }

    public void setTarih(ZonedDateTime tarih) {
        this.tarih = tarih;
    }

    public User getUser() {
        return user;
    }

    public Virman user(User user) {
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
        if (!(o instanceof Virman)) {
            return false;
        }
        return id != null && id.equals(((Virman) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Virman{" +
            "id=" + getId() +
            ", tutar=" + getTutar() +
            ", notlar='" + getNotlar() + "'" +
            ", cikisHesabi='" + getCikisHesabi() + "'" +
            ", grisiHesabi='" + getGrisiHesabi() + "'" +
            ", tarih='" + getTarih() + "'" +
            "}";
    }
}
