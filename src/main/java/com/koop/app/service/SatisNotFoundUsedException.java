package com.koop.app.service;

public class SatisNotFoundUsedException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public SatisNotFoundUsedException() {
        super("Satisin onceki hali aramasinda hata alindi");
    }
}
