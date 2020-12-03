package com.koop.app.dto;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

public class UrunStokGirisiDTO {

    private Long stokGirisiId;

    private BigDecimal miktar;

    private String stokGirisAciklamasi;

    private ZonedDateTime stokGirisiTarihi;

    public Long getStokGirisiId() {
        return stokGirisiId;
    }

    public void setStokGirisiId(Long stokGirisiId) {
        this.stokGirisiId = stokGirisiId;
    }

    public String getStokGirisAciklamasi() {
        return stokGirisAciklamasi;
    }

    public void setStokGirisAciklamasi(String stokGirisAciklamasi) {
        this.stokGirisAciklamasi = stokGirisAciklamasi;
    }

    public ZonedDateTime getStokGirisiTarihi() {
        return stokGirisiTarihi;
    }

    public void setStokGirisiTarihi(ZonedDateTime stokGirisiTarihi) {
        this.stokGirisiTarihi = stokGirisiTarihi;
    }

    public BigDecimal getMiktar() {
        return miktar;
    }

    public void setMiktar(BigDecimal miktar) {
        this.miktar = miktar;
    }
}
