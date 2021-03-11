package com.koop.app.service;

public class StockChangedException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public StockChangedException() {
        super("Satis esnasinda stok degistirilmis, stok yenileme tusuna basin!");
    }
}
