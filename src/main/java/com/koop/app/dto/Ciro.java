package com.koop.app.dto;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

public class Ciro {

    private BigDecimal tutar;

    private ZonedDateTime tarih;

    public Ciro(BigDecimal tutar, ZonedDateTime tarih) {
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

    public ZonedDateTime getTarih() {
        return tarih;
    }

    public void setTarih(ZonedDateTime tarih) {
        this.tarih = tarih;
    }
}
