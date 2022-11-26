package com.koop.app.service;

import com.koop.app.domain.BorcAlacak;
import com.koop.app.domain.Urun;
import com.koop.app.domain.enumeration.HareketTipi;
import com.koop.app.domain.enumeration.OdemeAraci;
import com.koop.app.dto.FiyatHesapDTO;
import com.koop.app.repository.BorcAlacakRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Service
public class BorcAlacakService {
    private final BorcAlacakRepository borcAlacakRepository;

    public BorcAlacakService(
        BorcAlacakRepository borcAlacakRepository) {
        this.borcAlacakRepository = borcAlacakRepository;
    }

    public void createBorcAlacak(FiyatHesapDTO fiyatHesapDTO, Urun urun) {
        BorcAlacak borcAlacak = new BorcAlacak();
        borcAlacak.setTarih(ZonedDateTime.now());
        borcAlacak.setHareketTipi(HareketTipi.ODEME);
        borcAlacak.setUrun(urun);
        borcAlacak.setOdemeAraci(OdemeAraci.BANKA);
        borcAlacak.setNotlar(urun.getUretici().getAdi() + " ureticisi icin borc");
        double kdvOraniCarpimi = (100 + urun.getKdvKategorisi().getKdvOrani()) * 0.01;
        borcAlacak.setTutar(fiyatHesapDTO.getTutar().multiply(BigDecimal.valueOf(kdvOraniCarpimi)));
        borcAlacakRepository.save(borcAlacak);
    }
}
