package com.koop.app.dto;

public class AylikSatislar {

    private int year;

    private int month;

    private String urunAdi;

    private long miktar;

    public AylikSatislar(int year, int month, String urunAdi, long miktar) {
        this.year = year;
        this.month = month;
        this.urunAdi = urunAdi;
        this.miktar = miktar;
    }

    public AylikSatislar() {}

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public String getUrunAdi() {
        return urunAdi;
    }

    public void setUrunAdi(String urunAdi) {
        this.urunAdi = urunAdi;
    }

    public long getMiktar() {
        return miktar;
    }

    public void setMiktar(long miktar) {
        this.miktar = miktar;
    }
}
