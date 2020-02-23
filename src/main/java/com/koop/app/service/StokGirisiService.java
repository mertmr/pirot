package com.koop.app.service;

import com.koop.app.domain.StokGirisi;
import com.koop.app.domain.Urun;
import com.koop.app.domain.enumeration.Birim;
import com.koop.app.domain.enumeration.StokHareketiTipi;
import com.koop.app.repository.StokGirisiRepository;
import com.koop.app.repository.UrunRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class StokGirisiService {

    private final StokGirisiRepository stokGirisiRepository;

    private final UrunRepository urunRepository;

    private final KasaHareketleriService kasaHareketleriService;

    public StokGirisiService(StokGirisiRepository stokGirisiRepository, UrunRepository urunRepository, KasaHareketleriService kasaHareketleriService) {
        this.stokGirisiRepository = stokGirisiRepository;
        this.urunRepository = urunRepository;
        this.kasaHareketleriService = kasaHareketleriService;
    }

    public StokGirisi save(StokGirisi stokGirisi) {
        Urun urun = stokGirisi.getUrun();
        if (urun.getStok() == null || urun.getStok().compareTo(BigDecimal.ZERO) < 0) {
            urun.setStok(BigDecimal.ZERO);
        }

        if (stokGirisi.getStokHareketiTipi() == StokHareketiTipi.STOK_GIRISI) {
            urun.setStok(urun.getStok().add(BigDecimal.valueOf(stokGirisi.getMiktar())));
        } else if (stokGirisi.getStokHareketiTipi() == StokHareketiTipi.FIRE) {
            urun.setStok(urun.getStok().subtract(BigDecimal.valueOf(stokGirisi.getMiktar())));
        } else if (stokGirisi.getStokHareketiTipi() == StokHareketiTipi.STOK_DUZELTME) {
            urun.setStok(urun.getStok().add(BigDecimal.valueOf(stokGirisi.getMiktar())));
        } else if (stokGirisi.getStokHareketiTipi() == StokHareketiTipi.MASRAF) {
            urun.setStok(urun.getStok().subtract(BigDecimal.valueOf(stokGirisi.getMiktar())));
        } else if (stokGirisi.getStokHareketiTipi() == StokHareketiTipi.IADE) {
            urun.setStok(urun.getStok().add(BigDecimal.valueOf(stokGirisi.getMiktar())));
            BigDecimal musteriFiyati = urun.getMusteriFiyati();
            if(urun.getBirim() == Birim.GRAM) {
                musteriFiyati = urun.getMusteriFiyati().multiply(BigDecimal.valueOf(0.001));
            }
            kasaHareketleriService.createKasaHareketi(musteriFiyati.multiply(BigDecimal.valueOf(stokGirisi.getMiktar())),
                "Musteri iadesi: Para kasaya geri dondu");
        }

        urunRepository.save(urun);
        return stokGirisiRepository.save(stokGirisi);
    }

    public StokGirisi update(StokGirisi stokGirisi) {
        return stokGirisiRepository.save(stokGirisi);
    }
}
