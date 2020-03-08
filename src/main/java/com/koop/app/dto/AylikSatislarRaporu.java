package com.koop.app.dto;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;

public class AylikSatislarRaporu {
    private Map<String, Long> aylikSatisMap;

    private List<ZonedDateTime> tarihListesi;

    private List<String> urunAdiListesi;

    public Map<String, Long> getAylikSatisMap() {
        return aylikSatisMap;
    }

    public void setAylikSatisMap(Map<String, Long> aylikSatisMap) {
        this.aylikSatisMap = aylikSatisMap;
    }

    public List<ZonedDateTime> getTarihListesi() {
        return tarihListesi;
    }

    public void setTarihListesi(List<ZonedDateTime> tarihListesi) {
        this.tarihListesi = tarihListesi;
    }

    public List<String> getUrunAdiListesi() {
        return urunAdiListesi;
    }

    public void setUrunAdiListesi(List<String> urunAdiListesi) {
        this.urunAdiListesi = urunAdiListesi;
    }
}
