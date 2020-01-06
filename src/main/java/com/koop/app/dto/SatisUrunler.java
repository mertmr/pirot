package com.koop.app.dto;

import com.koop.app.domain.Satis;
import com.koop.app.domain.SatisStokHareketleri;

import java.util.List;
import java.util.Set;

public class SatisUrunler {
    private Satis satis;

    private Set<SatisStokHareketleri> satisStokHareketleriList;

    public SatisUrunler() {
    }

    public Satis getSatis() {
        return satis;
    }

    public void setSatis(Satis satis) {
        this.satis = satis;
    }

    public Set<SatisStokHareketleri> getSatisStokHareketleriList() {
        return satisStokHareketleriList;
    }

    public void setSatisStokHareketleriList(Set<SatisStokHareketleri> satisStokHareketleriList) {
        this.satisStokHareketleriList = satisStokHareketleriList;
    }
}
