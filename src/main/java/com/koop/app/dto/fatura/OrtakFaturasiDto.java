package com.koop.app.dto.fatura;

import java.util.List;

public class OrtakFaturasiDto {
    private List<OrtakFaturasiDetayDto> ortakFaturasiDetayDto;

    private List<KdvToplam> kdvToplamList;
    private double tumKdvToplami;
    private double tumToplamKdvHaric;
    private double tumToplam;

    public List<OrtakFaturasiDetayDto> getOrtakFaturasiDetayDto() {
        return ortakFaturasiDetayDto;
    }

    public void setOrtakFaturasiDetayDto(List<OrtakFaturasiDetayDto> ortakFaturasiDetayDto) {
        this.ortakFaturasiDetayDto = ortakFaturasiDetayDto;
    }

    public List<KdvToplam> getKdvToplamList() {
        return kdvToplamList;
    }

    public void setKdvToplamList(List<KdvToplam> kdvToplamList) {
        this.kdvToplamList = kdvToplamList;
    }

    public void setTumKdvToplami(double tumKdvToplami) {
        this.tumKdvToplami = tumKdvToplami;
    }

    public double getTumKdvToplami() {
        return tumKdvToplami;
    }

    public void setTumToplamKdvHaric(double tumToplamKdvHaric) {
        this.tumToplamKdvHaric = tumToplamKdvHaric;
    }

    public double getTumToplamKdvHaric() {
        return tumToplamKdvHaric;
    }

    public void setTumToplam(double tumToplam) {
        this.tumToplam = tumToplam;
    }

    public double getTumToplam() {
        return tumToplam;
    }
}
