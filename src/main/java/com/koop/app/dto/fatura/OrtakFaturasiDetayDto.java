package com.koop.app.dto.fatura;

import com.koop.app.domain.KdvKategorisi;
import java.math.BigDecimal;

public class OrtakFaturasiDetayDto {

    private String urunAdiKdv;

    private String miktar;

    private BigDecimal birimFiyat;

    private BigDecimal toplamTutar;

    private KdvKategorisi kdvKategorisi;

    public KdvKategorisi getKdvKategorisi() {
        return kdvKategorisi;
    }

    public void setKdvKategorisi(KdvKategorisi kdvKategorisi) {
        this.kdvKategorisi = kdvKategorisi;
    }

    public String getUrunAdiKdv() {
        return urunAdiKdv;
    }

    public void setUrunAdiKdv(String urunAdiKdv) {
        this.urunAdiKdv = urunAdiKdv;
    }

    public String getMiktar() {
        return miktar;
    }

    public void setMiktar(String miktar) {
        this.miktar = miktar;
    }

    public BigDecimal getBirimFiyat() {
        return birimFiyat;
    }

    public void setBirimFiyat(BigDecimal birimFiyat) {
        this.birimFiyat = birimFiyat;
    }

    public BigDecimal getToplamTutar() {
        return toplamTutar;
    }

    public void setToplamTutar(BigDecimal toplamTutar) {
        this.toplamTutar = toplamTutar;
    }
}
