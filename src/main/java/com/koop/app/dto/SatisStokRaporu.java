package com.koop.app.dto;

import com.koop.app.domain.SatisStokHareketleri;

public class SatisStokRaporu {
    private long toplamSatisMiktari;

    private SatisStokHareketleri satisStokHareketleri;

    public SatisStokRaporu(long toplamSatisMiktari, SatisStokHareketleri satisStokHareketleri) {
        this.toplamSatisMiktari = toplamSatisMiktari;
        this.satisStokHareketleri = satisStokHareketleri;
    }

    public SatisStokRaporu() {
    }

    public long getToplamSatisMiktari() {
        return toplamSatisMiktari;
    }

    public void setToplamSatisMiktari(long toplamSatisMiktari) {
        this.toplamSatisMiktari = toplamSatisMiktari;
    }

    public SatisStokHareketleri getSatisStokHareketleri() {
        return satisStokHareketleri;
    }

    public void setSatisStokHareketleri(SatisStokHareketleri satisStokHareketleri) {
        this.satisStokHareketleri = satisStokHareketleri;
    }
}
