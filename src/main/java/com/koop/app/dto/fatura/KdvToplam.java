package com.koop.app.dto.fatura;

import java.math.BigDecimal;

public class KdvToplam {
    private String kdvKategorisi;

    private BigDecimal kdvTutari;

    public String getKdvKategorisi() {
        return kdvKategorisi;
    }

    public void setKdvKategorisi(String kdvKategorisi) {
        this.kdvKategorisi = kdvKategorisi;
    }

    public BigDecimal getKdvTutari() {
        return kdvTutari;
    }

    public void setKdvTutari(BigDecimal kdvTutari) {
        this.kdvTutari = kdvTutari;
    }
}
