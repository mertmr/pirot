package com.koop.app.service;

import com.koop.app.domain.StokGirisi;
import com.koop.app.domain.Urun;
import com.koop.app.domain.enumeration.StokHareketiTipi;
import com.koop.app.repository.StokGirisiRepository;
import com.koop.app.repository.UrunRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class StokGirisiService {

    private final StokGirisiRepository stokGirisiRepository;

    private final UrunRepository urunRepository;

    public StokGirisiService(StokGirisiRepository stokGirisiRepository, UrunRepository urunRepository) {
        this.stokGirisiRepository = stokGirisiRepository;
        this.urunRepository = urunRepository;
    }

    public StokGirisi save(StokGirisi stokGirisi) {
        Urun urun = stokGirisi.getUrun();
        if (urun.getStok() == null) {
            urun.setStok(BigDecimal.ZERO);
        }

        if (stokGirisi.getStokHareketiTipi() == StokHareketiTipi.STOK_GIRISI) {
            urun.setStok(urun.getStok().add(BigDecimal.valueOf(stokGirisi.getMiktar())));
        } else if (stokGirisi.getStokHareketiTipi() == StokHareketiTipi.FIRE) {
            urun.setStok(urun.getStok().subtract(BigDecimal.valueOf(stokGirisi.getMiktar())));
        } else if (stokGirisi.getStokHareketiTipi() == StokHareketiTipi.STOK_DUZELTME) {
            urun.setStok(BigDecimal.valueOf(stokGirisi.getMiktar()));
        } else if (stokGirisi.getStokHareketiTipi() == StokHareketiTipi.MASRAF) { //todo sorulmali
            urun.setStok(urun.getStok().subtract(BigDecimal.valueOf(stokGirisi.getMiktar())));
        }
        urunRepository.save(urun);
        return stokGirisiRepository.save(stokGirisi);
    }

    public StokGirisi update(StokGirisi stokGirisi) {
        return stokGirisiRepository.save(stokGirisi);
    }
}
