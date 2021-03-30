package com.koop.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.koop.app.config.tenancy.TenantEntity;
import com.koop.app.domain.enumeration.AcilisKapanis;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A NobetHareketleri.
 */
@Entity
@Table(name = "nobet_hareketleri")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class NobetHareketleri extends TenantEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "kasa", precision = 21, scale = 2)
    private BigDecimal kasa;

    @Column(name = "pirot", precision = 21, scale = 2)
    private BigDecimal pirot;

    @Column(name = "fark", precision = 21, scale = 2)
    private BigDecimal fark;

    @Column(name = "fark_denge", precision = 21, scale = 2)
    private BigDecimal farkDenge;

    @Column(name = "nobet_suresi", precision = 21, scale = 2)
    private BigDecimal nobetSuresi;

    @Column(name = "notlar")
    private String notlar;

    @Enumerated(EnumType.STRING)
    @Column(name = "acilis_kapanis")
    private AcilisKapanis acilisKapanis;

    @Column(name = "tarih")
    private ZonedDateTime tarih;

    @ManyToOne
    @JsonIgnoreProperties(value = "nobetHareketleris", allowSetters = true)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getKasa() {
        return kasa;
    }

    public NobetHareketleri kasa(BigDecimal kasa) {
        this.kasa = kasa;
        return this;
    }

    public void setKasa(BigDecimal kasa) {
        this.kasa = kasa;
    }

    public BigDecimal getPirot() {
        return pirot;
    }

    public NobetHareketleri pirot(BigDecimal pirot) {
        this.pirot = pirot;
        return this;
    }

    public void setPirot(BigDecimal pirot) {
        this.pirot = pirot;
    }

    public BigDecimal getFark() {
        return fark;
    }

    public NobetHareketleri fark(BigDecimal fark) {
        this.fark = fark;
        return this;
    }

    public void setFark(BigDecimal fark) {
        this.fark = fark;
    }

    public BigDecimal getFarkDenge() {
        return farkDenge;
    }

    public NobetHareketleri farkDenge(BigDecimal farkDenge) {
        this.farkDenge = farkDenge;
        return this;
    }

    public void setFarkDenge(BigDecimal farkDenge) {
        this.farkDenge = farkDenge;
    }

    public BigDecimal getNobetSuresi() {
        return nobetSuresi;
    }

    public NobetHareketleri nobetSuresi(BigDecimal nobetSuresi) {
        this.nobetSuresi = nobetSuresi;
        return this;
    }

    public void setNobetSuresi(BigDecimal nobetSuresi) {
        this.nobetSuresi = nobetSuresi;
    }

    public String getNotlar() {
        return notlar;
    }

    public NobetHareketleri notlar(String notlar) {
        this.notlar = notlar;
        return this;
    }

    public void setNotlar(String notlar) {
        this.notlar = notlar;
    }

    public AcilisKapanis getAcilisKapanis() {
        return acilisKapanis;
    }

    public NobetHareketleri acilisKapanis(AcilisKapanis acilisKapanis) {
        this.acilisKapanis = acilisKapanis;
        return this;
    }

    public void setAcilisKapanis(AcilisKapanis acilisKapanis) {
        this.acilisKapanis = acilisKapanis;
    }

    public ZonedDateTime getTarih() {
        return tarih;
    }

    public NobetHareketleri tarih(ZonedDateTime tarih) {
        this.tarih = tarih;
        return this;
    }

    public void setTarih(ZonedDateTime tarih) {
        this.tarih = tarih;
    }

    public User getUser() {
        return user;
    }

    public NobetHareketleri user(User user) {
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
        if (!(o instanceof NobetHareketleri)) {
            return false;
        }
        return id != null && id.equals(((NobetHareketleri) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "NobetHareketleri{" +
            "id=" + getId() +
            ", kasa=" + getKasa() +
            ", pirot=" + getPirot() +
            ", fark=" + getFark() +
            ", farkDenge=" + getFarkDenge() +
            ", nobetSuresi=" + getNobetSuresi() +
            ", notlar='" + getNotlar() + "'" +
            ", acilisKapanis='" + getAcilisKapanis() + "'" +
            ", tarih='" + getTarih() + "'" +
            "}";
    }
}
