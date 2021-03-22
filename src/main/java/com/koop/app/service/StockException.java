package com.koop.app.service;

public class StockException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public StockException() {
        super("Urun kaydetmede hata olustu, hemen MERT MERALE haber edin!!!");
    }
}
