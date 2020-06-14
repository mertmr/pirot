package com.koop.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.koop.app.domain.enumeration.Hesap;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Objects;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Virman.
 */
@Entity
@Table(name = "virman")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Virman implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "tutar", precision = 21, scale = 2, nullable = false)
    private BigDecimal tutar;

    @NotNull
    @Column(name = "notlar", nullable = false)
    private String notlar;

    @Enumerated(EnumType.STRING)
    @Column(name = "cikis_hesabi")
    private Hesap cikisHesabi;

    @Enumerated(EnumType.STRING)
    @Column(name = "giris_hesabi")
    private Hesap girisHesabi;

    @Column(name = "tarih")
    private ZonedDateTime tarih;

    @ManyToOne
    @JsonIgnoreProperties(value = "virmen", allowSetters = true)
    private User user;

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

    public Virman tutar(BigDecimal tutar) {
        this.tutar = tutar;
        return this;
    }

    public void setTutar(BigDecimal tutar) {
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

    public Hesap getGirisHesabi() {
        return girisHesabi;
    }

    public Virman girisHesabi(Hesap girisHesabi) {
        this.girisHesabi = girisHesabi;
        return this;
    }

    public void setGirisHesabi(Hesap girisHesabi) {
        this.girisHesabi = girisHesabi;
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
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

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

    // prettier-ignore
    @Override
    public String toString() {
        return (
            "Virman{" +
            "id=" +
            getId() +
            ", tutar=" +
            getTutar() +
            ", notlar='" +
            getNotlar() +
            "'" +
            ", cikisHesabi='" +
            getCikisHesabi() +
            "'" +
            ", girisHesabi='" +
            getGirisHesabi() +
            "'" +
            ", tarih='" +
            getTarih() +
            "'" +
            "}"
        );
    }
}
