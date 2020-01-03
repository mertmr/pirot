package com.koop.app.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.time.ZonedDateTime;

/**
 * A Satis.
 */
@Entity
@Table(name = "satis")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Satis implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "tarih")
    private ZonedDateTime tarih;

    @ManyToOne
    @JsonIgnoreProperties("satis")
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getTarih() {
        return tarih;
    }

    public Satis tarih(ZonedDateTime tarih) {
        this.tarih = tarih;
        return this;
    }

    public void setTarih(ZonedDateTime tarih) {
        this.tarih = tarih;
    }

    public User getUser() {
        return user;
    }

    public Satis user(User user) {
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
        if (!(o instanceof Satis)) {
            return false;
        }
        return id != null && id.equals(((Satis) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Satis{" +
            "id=" + getId() +
            ", tarih='" + getTarih() + "'" +
            "}";
    }
}
