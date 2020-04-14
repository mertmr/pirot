package com.koop.app.service;

import com.koop.app.domain.*;
import com.koop.app.repository.SatisRepository;
import com.koop.app.repository.SatisStokHareketleriRepository;
import com.koop.app.repository.UrunRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.groupingBy;

@Service
public class SatisService {
    private final SatisRepository satisRepository;

    private final UserService userService;

    private final SatisStokHareketleriRepository satisStokHareketleriRepository;

    private final KasaHareketleriService kasaHareketleriService;

    private final UrunRepository urunRepository;

    private final KisilerService kisilerService;

    public SatisService(
        SatisRepository satisRepository,
        UserService userService,
        SatisStokHareketleriRepository satisStokHareketleriRepository,
        KasaHareketleriService kasaHareketleriService,
        UrunRepository urunRepository,
        KisilerService kisilerService
    ) {
        this.satisRepository = satisRepository;
        this.userService = userService;
        this.satisStokHareketleriRepository = satisStokHareketleriRepository;
        this.kasaHareketleriService = kasaHareketleriService;
        this.urunRepository = urunRepository;
        this.kisilerService = kisilerService;
    }

    public Satis createSatis(Satis satis) {
        if (satis.getTarih() == null) {
            satis.setTarih(ZonedDateTime.now());
        }
        Set<SatisStokHareketleri> stokHareketleriLists = satis.getStokHareketleriLists();
        User currentUser = userService.getCurrentUser();
        satis.setUser(currentUser);
        if (satis.getTarih() == null) satis.setTarih(ZonedDateTime.now());

        if (satis.isOrtagaSatis()) {
            satis.setKisi(kisilerService.getRandomKisi());
        }
        Satis result = satisRepository.save(satis);

        stokHareketleriLists.forEach(satisStokHareketleri -> satisStokHareketleri.setSatis(satis));

        for (SatisStokHareketleri stokHareketi : stokHareketleriLists) {
            Urun urun = stokHareketi.getUrun();
            if (urun.getStok() != null) {
                urun.setStok(urun.getStok().subtract(BigDecimal.valueOf(stokHareketi.getMiktar())));
            }
        }
        satisStokHareketleriRepository.saveAll(stokHareketleriLists);
        List<Urun> urunList = stokHareketleriLists.stream().map(SatisStokHareketleri::getUrun).collect(Collectors.toList());
        urunRepository.saveAll(urunList);

        if (!satis.isKartliSatis()) {
            kasaHareketleriService.createKasaHareketi(satis.getToplamTutar(), "Satis Yapildi");
        }

        return result;
    }

    public Satis updateSatis(Satis satis) {
        User currentUser = userService.getCurrentUser();
        satis.setUser(currentUser);
        Satis satisOncekiHali = satisRepository.findById(satis.getId()).get();

        if (!satisOncekiHali.isOrtagaSatis() && satis.isOrtagaSatis()) {
            satis.setKisi(kisilerService.getRandomKisi());
        } else if (satisOncekiHali.isOrtagaSatis() && !satis.isOrtagaSatis()) {
            satis.setKisi(null);
        }

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

        List<SatisStokHareketleri> cikarilanUrunler = satisOncekiHali.getStokHareketleriLists().stream().
            filter(satisStokHareketleri -> !stokHareketleriLists.contains(satisStokHareketleri)).collect(Collectors.toList());

        for (SatisStokHareketleri cikarilanUrunHareketi : cikarilanUrunler) {
            Urun urun = cikarilanUrunHareketi.getUrun();
            urun.setStok(urun.getStok().add(BigDecimal.valueOf(cikarilanUrunHareketi.getMiktar())));
        }


        Map<Long, SatisStokHareketleri> stokHareketMap = stokHareketleriLists
            .stream()
            .collect(Collectors.toMap(SatisStokHareketleri::getId, satisStokHareketleri -> satisStokHareketleri));
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

    /**
     * Eski pirottan gecis yapilabilmesi icin bir migration kodu, sonrasinda kaldirilmali
     */
    public void migrateToplamTutar() {
        List<SatisStokHareketleri> satisStokHareketleriList = satisStokHareketleriRepository.findAllWithSatis();
        Map<Long, List<SatisStokHareketleri>> satisStokMap = satisStokHareketleriList.stream()
            .collect(groupingBy(satisStokHareketleri -> satisStokHareketleri.getSatis().getId()));

        List<Satis> satisListToSave = new ArrayList<>();
        for (Long satisId : satisStokMap.keySet()) {
            List<SatisStokHareketleri> satisStokHareketleris = satisStokMap.get(satisId);
            double sum = satisStokHareketleris.stream().
                mapToDouble(satisStokHareketleri -> satisStokHareketleri.getTutar().doubleValue()).sum();
            Optional<SatisStokHareketleri> satisStokHareketi = satisStokHareketleris.stream().findFirst();
            satisStokHareketi.ifPresent(satisStok -> {
                Satis satis = satisStok.getSatis();
                satis.setToplamTutar(BigDecimal.valueOf(sum));
                satisListToSave.add(satis);
            });
        }

        satisRepository.saveAll(satisListToSave);
        //todo duzgun calistiktan sonra diff i tekrar ac
    }
}
