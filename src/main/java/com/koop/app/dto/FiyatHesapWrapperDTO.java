package com.koop.app.dto;

import java.util.List;

public class FiyatHesapWrapperDTO {
    private List<FiyatHesapDTO> fiyatHesapDTOList;

    public List<FiyatHesapDTO> getFiyatHesapDTOList() {
        return fiyatHesapDTOList;
    }

    public void setFiyatHesapDTOList(List<FiyatHesapDTO> fiyatHesapDTOList) {
        this.fiyatHesapDTOList = fiyatHesapDTOList;
    }
}
