package com.koop.app.dto.fatura;

import com.koop.app.domain.DashboardReports;
import com.koop.app.domain.Gider;
import com.koop.app.domain.NobetHareketleri;
import com.koop.app.domain.Virman;
import com.koop.app.dto.Ciro;

import java.util.List;

public class GunSonuRaporuDto {

    private List<Gider> giderList;

    private Virman virman;

    private DashboardReports dashboardReports;

    private NobetHareketleri nobetHareketleri;

    public NobetHareketleri getNobetHareketleri() {
        return nobetHareketleri;
    }

    public void setNobetHareketleri(NobetHareketleri nobetHareketleri) {
        this.nobetHareketleri = nobetHareketleri;
    }

    public List<Gider> getGiderList() {
        return giderList;
    }

    public void setGiderList(List<Gider> giderList) {
        this.giderList = giderList;
    }

    public Virman getVirman() {
        return virman;
    }

    public void setVirman(Virman virman) {
        this.virman = virman;
    }

    public DashboardReports getDashboardReports() {
        return dashboardReports;
    }

    public void setDashboardReports(DashboardReports dashboardReports) {
        this.dashboardReports = dashboardReports;
    }
}
