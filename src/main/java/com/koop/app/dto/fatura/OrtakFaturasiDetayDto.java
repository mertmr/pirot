package com.koop.app.dto.fatura;

import java.math.BigDecimal;
import java.util.List;

public class OrtakFaturasiDetayDto {

    private String urunAdiKdv;

    private String miktar;

    private BigDecimal birimFiyat;

    private BigDecimal toplamTutar;

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
