package com.koop.app.service.dto;

import com.koop.app.domain.enumeration.StokHareketiTipi;
import java.time.ZonedDateTime;

public class StokGirisiDto {

    private Long id;

    private Integer miktar;

    private String notlar;

    private StokHareketiTipi stokHareketiTipi;

    private ZonedDateTime tarih;

    private String user;

    private String urunAdi;

    public StokGirisiDto(
        Long id,
        Integer miktar,
        String notlar,
        StokHareketiTipi stokHareketiTipi,
        ZonedDateTime tarih,
        String user,
        String urunAdi
    ) {
        this.id = id;
        this.miktar = miktar;
        this.notlar = notlar;
        this.stokHareketiTipi = stokHareketiTipi;
        this.tarih = tarih;
        this.user = user;
        this.urunAdi = urunAdi;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getMiktar() {
        return miktar;
    }

    public void setMiktar(Integer miktar) {
        this.miktar = miktar;
    }

    public String getNotlar() {
        return notlar;
    }

    public void setNotlar(String notlar) {
        this.notlar = notlar;
    }

    public StokHareketiTipi getStokHareketiTipi() {
        return stokHareketiTipi;
    }

    public void setStokHareketiTipi(StokHareketiTipi stokHareketiTipi) {
        this.stokHareketiTipi = stokHareketiTipi;
    }

    public ZonedDateTime getTarih() {
        return tarih;
    }

    public void setTarih(ZonedDateTime tarih) {
        this.tarih = tarih;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getUrunAdi() {
        return urunAdi;
    }

    public void setUrunAdi(String urunAdi) {
        this.urunAdi = urunAdi;
    }
}
