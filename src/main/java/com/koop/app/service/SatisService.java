package com.koop.app.service;

import com.koop.app.domain.KasaHareketleri;
import com.koop.app.domain.Satis;
import com.koop.app.domain.SatisStokHareketleri;
import com.koop.app.domain.User;
import com.koop.app.repository.SatisRepository;
import com.koop.app.repository.SatisStokHareketleriRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Optional;
import java.util.Set;

@Service
public class SatisService {

    private final SatisRepository satisRepository;

    private final UserService userService;

    private final SatisStokHareketleriRepository satisStokHareketleriRepository;

    private final KasaHareketleriService kasaHareketleriService;

    public SatisService(SatisRepository satisRepository, UserService userService, SatisStokHareketleriRepository satisStokHareketleriRepository, KasaHareketleriService kasaHareketleriService) {
        this.satisRepository = satisRepository;
        this.userService = userService;
        this.satisStokHareketleriRepository = satisStokHareketleriRepository;
        this.kasaHareketleriService = kasaHareketleriService;
    }

    public Satis createSatis(Satis satis) {
        if(satis.getTarih() == null) {
            satis.setTarih(ZonedDateTime.now());
        }
        User currentUser = userService.getCurrentUser();
        satis.setUser(currentUser);
        satis.setTarih(ZonedDateTime.now());
        Satis result = satisRepository.save(satis);

        Set<SatisStokHareketleri> stokHareketleriLists = satis.getStokHareketleriLists();
        stokHareketleriLists.forEach(satisStokHareketleri -> satisStokHareketleri.setSatis(satis));
        satisStokHareketleriRepository.saveAll(stokHareketleriLists);

        kasaHareketleriService.createKasaHareketi(satis.getToplamTutar(), "Satis Yapildi");
        return result;
    }

    public Satis updateSatis(Satis satis) {
        User currentUser = userService.getCurrentUser();
        satis.setUser(currentUser);
        Satis satisOncekiHali = satisRepository.findById(satis.getId()).get();
        BigDecimal kasaHareketiFarki = satis.getToplamTutar().subtract(satisOncekiHali.getToplamTutar());
        kasaHareketleriService.createKasaHareketi(kasaHareketiFarki, "Satis Guncellemesi");
        return satisRepository.save(satis);
    }
}
