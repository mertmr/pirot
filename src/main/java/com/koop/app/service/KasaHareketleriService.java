package com.koop.app.service;

import com.koop.app.domain.KasaHareketleri;
import com.koop.app.repository.KasaHareketleriRepository;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import org.springframework.stereotype.Service;

@Service
public class KasaHareketleriService {

    private final KasaHareketleriRepository kasaHareketleriRepository;

    public KasaHareketleriService(KasaHareketleriRepository kasaHareketleriRepository) {
        this.kasaHareketleriRepository = kasaHareketleriRepository;
    }

    /**
     * Yapilan satis/gider/virman islemi icin kasa hakeketi yaratilir
     * @param eklenecekTutar Eger satis gibi kasaya giren bir para varsa pozitif rakam gonderilir. Gider, virman gibi
     *                       kasadan cikan islemler icin negatif gonderilmeli. Ileride hareket tipi gibi bir enum
     *                       belirlenirse o enumla daha okunabilir hale getirilebilir.
     *
     *                       Eger bir hareket duzenlemeye ugruyorsa buraya gonderilen rakam duzenlemeye ugrayan tutarin
     *                       degisimi kadar olmalidir.
     * @param hareketMesaji Yapilan hareketi
     */
    public void createKasaHareketi(BigDecimal eklenecekTutar, String hareketMesaji) {
        KasaHareketleri newKasaHareketi = new KasaHareketleri();
        KasaHareketleri sonKasaHareketi = kasaHareketleriRepository.findFirstByOrderByTarihDesc();
        if (sonKasaHareketi == null) {
            sonKasaHareketi = new KasaHareketleri();
            sonKasaHareketi.setKasaMiktar(BigDecimal.ZERO);
        }

        newKasaHareketi.setKasaMiktar(sonKasaHareketi.getKasaMiktar().add(eklenecekTutar));
        newKasaHareketi.setHareket(hareketMesaji);
        newKasaHareketi.setTarih(ZonedDateTime.now());
        kasaHareketleriRepository.save(newKasaHareketi);
    }
}
