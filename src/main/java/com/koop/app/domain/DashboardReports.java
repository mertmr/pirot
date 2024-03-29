package com.koop.app.domain;

import java.math.BigDecimal;
import java.util.List;

public class DashboardReports {
    private double kasadaNeVar = 0;

    private double bankadaNeVar = 0;

    private double gunlukCiro = 0;

    private double kartliSatis = 0;

    private double nakitSatis = 0;

    private double toplamBorc = 0;

    private List<String> haftalikCiroTarihleri;

    private List<BigDecimal> haftalikCiroRakamlari;

    public List<String> getHaftalikCiroTarihleri() {
        return haftalikCiroTarihleri;
    }

    public void setHaftalikCiroTarihleri(List<String> haftalikCiroTarihleri) {
        this.haftalikCiroTarihleri = haftalikCiroTarihleri;
    }

    public List<BigDecimal> getHaftalikCiroRakamlari() {
        return haftalikCiroRakamlari;
    }

    public void setHaftalikCiroRakamlari(List<BigDecimal> haftalikCiroRakamlari) {
        this.haftalikCiroRakamlari = haftalikCiroRakamlari;
    }

    public double getKasadaNeVar() {
        return kasadaNeVar;
    }

    public void setKasadaNeVar(double kasadaNeVar) {
        this.kasadaNeVar = kasadaNeVar;
    }

    public double getBankadaNeVar() {
        return bankadaNeVar;
    }

    public void setBankadaNeVar(double bankadaNeVar) {
        this.bankadaNeVar = bankadaNeVar;
    }

    public double getGunlukCiro() {
        return gunlukCiro;
    }

    public void setGunlukCiro(double gunlukCiro) {
        this.gunlukCiro = gunlukCiro;
    }

    public double getKartliSatis() {
        return kartliSatis;
    }

    public void setKartliSatis(double kartliSatis) {
        this.kartliSatis = kartliSatis;
    }

    public double getNakitSatis() {
        return nakitSatis;
    }

    public void setNakitSatis(double nakitSatis) {
        this.nakitSatis = nakitSatis;
    }

    public double getToplamBorc() {
        return toplamBorc;
    }

    public void setToplamBorc(double toplamBorc) {
        this.toplamBorc = toplamBorc;
    }
}
