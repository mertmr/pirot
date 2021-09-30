package com.koop.app.dto;

import java.math.BigDecimal;

public class FiyatHesapDTO {

    private Long urunId;

    private String urunAdi;

    private BigDecimal yeniFiyat;

    private BigDecimal eskiFiyat;

    public Long getUrunId() {
        return urunId;
    }

    public void setUrunId(Long urunId) {
        this.urunId = urunId;
    }

    public BigDecimal getYeniFiyat() {
        return yeniFiyat;
    }

    public void setYeniFiyat(BigDecimal yeniFiyat) {
        this.yeniFiyat = yeniFiyat;
    }

    public String getUrunAdi() {
        return urunAdi;
    }

    public void setUrunAdi(String urunAdi) {
        this.urunAdi = urunAdi;
    }

    public BigDecimal getEskiFiyat() {
        return eskiFiyat;
    }

    public void setEskiFiyat(BigDecimal eskiFiyat) {
        this.eskiFiyat = eskiFiyat;
    }
}
