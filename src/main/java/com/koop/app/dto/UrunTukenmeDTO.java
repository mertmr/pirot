package com.koop.app.dto;

import com.koop.app.domain.SatisStokHareketleri;
import java.math.BigDecimal;
import java.util.List;

public class UrunTukenmeDTO {

    private BigDecimal aylikTukenmeHizi;

    private BigDecimal haftalikTukenmeHizi;

    private BigDecimal raporVeriOlcekSuresi;

    private List<SatisStokHareketleri> stokGunluguList;

    private BigDecimal urunFire;

    public BigDecimal getAylikTukenmeHizi() {
        return aylikTukenmeHizi;
    }

    public void setAylikTukenmeHizi(BigDecimal aylikTukenmeHizi) {
        this.aylikTukenmeHizi = aylikTukenmeHizi;
    }

    public BigDecimal getHaftalikTukenmeHizi() {
        return haftalikTukenmeHizi;
    }

    public void setHaftalikTukenmeHizi(BigDecimal haftalikTukenmeHizi) {
        this.haftalikTukenmeHizi = haftalikTukenmeHizi;
    }

    public List<SatisStokHareketleri> getStokGunluguList() {
        return stokGunluguList;
    }

    public void setStokGunluguList(List<SatisStokHareketleri> stokGunluguList) {
        this.stokGunluguList = stokGunluguList;
    }

    public BigDecimal getRaporVeriOlcekSuresi() {
        return raporVeriOlcekSuresi;
    }

    public void setRaporVeriOlcekSuresi(BigDecimal raporVeriOlcekSuresi) {
        this.raporVeriOlcekSuresi = raporVeriOlcekSuresi;
    }

    public void setUrunFire(BigDecimal urunFire) {
        this.urunFire = urunFire;
    }

    public BigDecimal getUrunFire() {
        return urunFire;
    }
}
