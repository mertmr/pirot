package com.koop.app.service;

import com.koop.app.domain.Satis;
import com.koop.app.domain.SatisStokHareketleri;
import com.koop.app.domain.Urun;
import com.koop.app.domain.User;
import com.koop.app.repository.SatisRepository;
import com.koop.app.repository.SatisStokHareketleriRepository;
import com.koop.app.repository.UrunRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class SatisService {

    private final SatisRepository satisRepository;

    private final UserService userService;

    private final SatisStokHareketleriRepository satisStokHareketleriRepository;

    private final KasaHareketleriService kasaHareketleriService;

    private final UrunRepository urunRepository;

    public SatisService(SatisRepository satisRepository, UserService userService,
                        SatisStokHareketleriRepository satisStokHareketleriRepository,
                        KasaHareketleriService kasaHareketleriService, UrunRepository urunRepository) {
        this.satisRepository = satisRepository;
        this.userService = userService;
        this.satisStokHareketleriRepository = satisStokHareketleriRepository;
        this.kasaHareketleriService = kasaHareketleriService;
        this.urunRepository = urunRepository;
    }

    public Satis createSatis(Satis satis) {
        if (satis.getTarih() == null) {
            satis.setTarih(ZonedDateTime.now());
        }
        Set<SatisStokHareketleri> stokHareketleriLists = satis.getStokHareketleriLists();
        User currentUser = userService.getCurrentUser();
        satis.setUser(currentUser);
        if (satis.getTarih() == null)
            satis.setTarih(ZonedDateTime.now());
        Satis result = satisRepository.save(satis);

        stokHareketleriLists.forEach(satisStokHareketleri -> satisStokHareketleri.setSatis(satis));

        for (SatisStokHareketleri stokHareketi : stokHareketleriLists) {
            Urun urun = stokHareketi.getUrun();
            if (urun.getStok() != null) {
                urun.setStok(urun.getStok().subtract(BigDecimal.valueOf(stokHareketi.getMiktar())));
            }
        }
        satisStokHareketleriRepository.saveAll(stokHareketleriLists);
        urunRepository.saveAll(stokHareketleriLists.stream().map(SatisStokHareketleri::getUrun).collect(Collectors.toList()));

        if (!satis.isKartliSatis()) {
            kasaHareketleriService.createKasaHareketi(satis.getToplamTutar(), "Satis Yapildi");
        }

        return result;
    }

    public Satis updateSatis(Satis satis) {
        User currentUser = userService.getCurrentUser();
        satis.setUser(currentUser);
        Satis satisOncekiHali = satisRepository.findById(satis.getId()).get();

        Set<SatisStokHareketleri> stokHareketleriLists = satis.getStokHareketleriLists();
        stokHareketleriLists.forEach(satisStokHareketleri -> satisStokHareketleri.setSatis(satis));

        for (SatisStokHareketleri satisStokHareketi : stokHareketleriLists) {
            Urun urun = satisStokHareketi.getUrun();
            if (satisStokHareketi.getUrun().getStok() != null) {
                if (satisStokHareketi.getId() != null) {
                    SatisStokHareketleri oncekiSatisStokHareketi = satisStokHareketleriRepository.findById(satisStokHareketi.getId()).get();
                    int stokDegisimi = oncekiSatisStokHareketi.getMiktar() - satisStokHareketi.getMiktar();
                    urun.setStok(urun.getStok().add(BigDecimal.valueOf(stokDegisimi)));
                } else {
                    urun.setStok(urun.getStok().add(BigDecimal.valueOf(satisStokHareketi.getMiktar())));
                }
            }
        }

        Map<Long, SatisStokHareketleri> stokHareketMap = stokHareketleriLists.stream().
            collect(Collectors.toMap(SatisStokHareketleri::getId, satisStokHareketleri -> satisStokHareketleri));
        for (SatisStokHareketleri stokHareketleri : satisOncekiHali.getStokHareketleriLists()) {
            if (!stokHareketMap.containsKey(stokHareketleri.getId())) {
                satisStokHareketleriRepository.delete(stokHareketleri);
            }
        }


        satisStokHareketleriRepository.saveAll(stokHareketleriLists);
        urunRepository.saveAll(stokHareketleriLists.stream().map(SatisStokHareketleri::getUrun).collect(Collectors.toList()));

        if (!satisOncekiHali.isKartliSatis() && !satis.isKartliSatis()) {
            BigDecimal kasaHareketiFarki = satis.getToplamTutar().subtract(satisOncekiHali.getToplamTutar());
            kasaHareketleriService.createKasaHareketi(kasaHareketiFarki, "Satis Guncellemesi");
        }
        if (satisOncekiHali.isKartliSatis() && !satis.isKartliSatis()) {
            kasaHareketleriService.createKasaHareketi(satis.getToplamTutar(), "Satis Guncellemesi");
        }
        if (!satisOncekiHali.isKartliSatis() && satis.isKartliSatis()) {
            kasaHareketleriService.createKasaHareketi(satis.getToplamTutar().negate(), "Satis Guncellemesi");
        }
        return satisRepository.save(satis);
    }

    public Page<Satis> search(String query, Pageable pageable) {
        return satisRepository.findSatisByLogin(query, pageable);
    }
}
