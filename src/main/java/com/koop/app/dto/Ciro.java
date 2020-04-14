package com.koop.app.dto;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Date;

public class Ciro {

    private BigDecimal tutar;

    private BigDecimal kartli;

    private BigDecimal nakit;

    private Date tarih;

    private String nobetci;

    public Ciro(BigDecimal tutar, BigDecimal kartli, BigDecimal nakit, Date tarih) {
        this.tutar = tutar;
        this.kartli = kartli;
        this.nakit = nakit;
        this.tarih = tarih;
    }

    public Ciro(BigDecimal tutar, BigDecimal kartli, BigDecimal nakit, Date tarih, String nobetci) {
        this.tutar = tutar;
        this.kartli = kartli;
        this.nakit = nakit;
        this.tarih = tarih;
        this.nobetci = nobetci;
    }

    public Ciro(BigDecimal tutar, int tarih) {
        this.tutar = tutar;
    }

    public Ciro() {}

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

    public BigDecimal getKartli() {
        return kartli;
    }

    public void setKartli(BigDecimal kartli) {
        this.kartli = kartli;
    }

    public BigDecimal getNakit() {
        return nakit;
    }

    public void setNakit(BigDecimal nakit) {
        this.nakit = nakit;
    }

    public String getNobetci() {
        return nobetci;
    }

    public void setNobetci(String nobetci) {
        this.nobetci = nobetci;
    }
}
