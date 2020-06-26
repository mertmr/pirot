package com.koop.app.dto.fatura;

import com.koop.app.domain.KdvKategorisi;
import com.koop.app.domain.Urun;
import java.math.BigDecimal;

public class OrtakFaturaDbReport {
    private String urunIsmi;

    private Long miktar;

    private Urun urun;

    private KdvKategorisi kdvKategorisi;

    private BigDecimal toplamTutar;

    public OrtakFaturaDbReport(
        String urunIsmi,
        Long miktar,
        Urun urun,
        KdvKategorisi kdvKategorisi,
        BigDecimal toplamTutar
    ) {
        this.urunIsmi = urunIsmi;
        this.miktar = miktar;
        this.urun = urun;
        this.kdvKategorisi = kdvKategorisi;
        this.toplamTutar = toplamTutar;
    }

    public String getUrunIsmi() {
        return urunIsmi;
    }

    public void setUrunIsmi(String urunIsmi) {
        this.urunIsmi = urunIsmi;
    }

    public Long getMiktar() {
        return miktar;
    }

    public void setMiktar(Long miktar) {
        this.miktar = miktar;
    }

    public Urun getUrun() {
        return urun;
    }

    public void setUrun(Urun urun) {
        this.urun = urun;
    }

    public KdvKategorisi getKdvKategorisi() {
        return kdvKategorisi;
    }

    public void setKdvKategorisi(KdvKategorisi kdvKategorisi) {
        this.kdvKategorisi = kdvKategorisi;
    }

    public BigDecimal getToplamTutar() {
        return toplamTutar;
    }

    public void setToplamTutar(BigDecimal toplamTutar) {
        this.toplamTutar = toplamTutar;
    }
}
