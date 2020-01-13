package com.koop.app.dto;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Date;

public class Ciro {

    private BigDecimal tutar;

    private Date tarih;

    public Ciro(BigDecimal tutar, Date tarih) {
        this.tutar = tutar;
        this.tarih = tarih;
    }

    public Ciro() {
    }

    public BigDecimal getTutar() {
        return tutar;
    }

    public void setTutar(BigDecimal tutar) {
        this.tutar = tutar;
    }

    public Date getTarih() {
        return tarih;
    }

    public void setTarih(Date tarih) {
        this.tarih = tarih;
    }
}
