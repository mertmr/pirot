package com.koop.app.service;

import com.koop.app.domain.Satis;
import com.koop.app.domain.SatisStokHareketleri;
import com.koop.app.domain.Urun;
import com.koop.app.domain.User;
import com.koop.app.repository.SatisRepository;
import com.koop.app.repository.SatisStokHareketleriRepository;
import com.koop.app.repository.UrunRepository;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class SatisService {
    private static final String SATIS_GUNCELLEMESI = "Satis Guncellemesi";

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

        if (Boolean.TRUE.equals(satis.isOrtagaSatis())) {
            satis.setKisi(kisilerService.getRandomKisi());
        }
        Satis result = satisRepository.save(satis);

        stokHareketleriLists.forEach(satisStokHareketleri -> satisStokHareketleri.setSatis(satis));
        controlIfStockCHanged(stokHareketleriLists);

        for (SatisStokHareketleri stokHareketi : stokHareketleriLists) {
            Urun urun = stokHareketi.getUrun();
            if (urun.getStok() != null) {
                urun.setStok(urun.getStok().subtract(BigDecimal.valueOf(stokHareketi.getMiktar())));
            }
        }
        satisStokHareketleriRepository.saveAll(stokHareketleriLists);
        List<Urun> urunList = stokHareketleriLists
            .stream()
            .map(SatisStokHareketleri::getUrun)
            .collect(Collectors.toList());
        urunRepository.saveAll(urunList);

        if (Boolean.FALSE.equals(satis.isKartliSatis())) {
            kasaHareketleriService.createKasaHareketi(satis.getToplamTutar(), "Satis Yapildi");
        }

        return result;
    }

    private void controlIfStockCHanged(Set<SatisStokHareketleri> stokHareketleriLists) {
        List<Long> urunIdList = stokHareketleriLists.stream()
            .map(satisStokHareketleri -> satisStokHareketleri.getUrun().getId()).collect(Collectors.toList());
        List<Urun> urunList = urunRepository.findByIdIn(urunIdList);
        Map<Long, Urun> satisUrunList = stokHareketleriLists.stream()
            .collect(Collectors.toMap(satisStokHareketleri -> satisStokHareketleri.getUrun().getId(), SatisStokHareketleri::getUrun));
        for (Urun urun : urunList) {
            Urun satisUrunu = satisUrunList.get(urun.getId());
            if(urun.getStok().compareTo(satisUrunu.getStok()) != 0){
                throw new StockChangedException();
            }
        }

    }

    public Satis updateSatis(Satis satis) {
        User currentUser = userService.getCurrentUser();
        satis.setUser(currentUser);
        Optional<Satis> satisOncekiHaliOptional = satisRepository.findById(satis.getId());
        Satis satisOncekiHali = satisOncekiHaliOptional.orElseThrow(SatisNotFoundUsedException::new);
        if (Boolean.FALSE.equals(satisOncekiHali.isOrtagaSatis()) && Boolean.TRUE.equals(satis.isOrtagaSatis())) {
            satis.setKisi(kisilerService.getRandomKisi());
        } else if (
            Boolean.TRUE.equals(satisOncekiHali.isOrtagaSatis()) && Boolean.FALSE.equals(satis.isOrtagaSatis())
        ) {
            satis.setKisi(null);
        }

        Set<SatisStokHareketleri> stokHareketleriLists = satis.getStokHareketleriLists();
        stokHareketleriLists.forEach(satisStokHareketleri -> satisStokHareketleri.setSatis(satis));

        makeStokUpdates(stokHareketleriLists);

        List<SatisStokHareketleri> cikarilanUrunler = satisOncekiHali
            .getStokHareketleriLists()
            .stream()
            .filter(satisStokHareketleri -> !stokHareketleriLists.contains(satisStokHareketleri))
            .collect(Collectors.toList());

        for (SatisStokHareketleri cikarilanUrunHareketi : cikarilanUrunler) {
            Urun urun = cikarilanUrunHareketi.getUrun();
            urun.setStok(urun.getStok().add(BigDecimal.valueOf(cikarilanUrunHareketi.getMiktar())));
        }

        Map<Long, SatisStokHareketleri> stokHareketMap = stokHareketleriLists
            .stream()
            .filter(satisStokHareketleri -> satisStokHareketleri.getId() != null)
            .collect(Collectors.toMap(SatisStokHareketleri::getId, satisStokHareketleri -> satisStokHareketleri));
        for (SatisStokHareketleri stokHareketleri : satisOncekiHali.getStokHareketleriLists()) {
            if (!stokHareketMap.containsKey(stokHareketleri.getId())) {
                satisStokHareketleriRepository.delete(stokHareketleri);
            }
        }

        satisStokHareketleriRepository.saveAll(stokHareketleriLists);
        urunRepository.saveAll(
            stokHareketleriLists.stream().map(SatisStokHareketleri::getUrun).collect(Collectors.toList())
        );

        createSatisUpdateHareketi(satis, satisOncekiHali);
        return satisRepository.save(satis);
    }

    private void createSatisUpdateHareketi(Satis satis, Satis satisOncekiHali) {
        if (Boolean.FALSE.equals(satisOncekiHali.isKartliSatis()) && Boolean.FALSE.equals(satis.isKartliSatis())) {
            BigDecimal kasaHareketiFarki = satis.getToplamTutar().subtract(satisOncekiHali.getToplamTutar());
            kasaHareketleriService.createKasaHareketi(kasaHareketiFarki, SATIS_GUNCELLEMESI);
        }
        if (Boolean.TRUE.equals(satisOncekiHali.isKartliSatis()) && Boolean.FALSE.equals(satis.isKartliSatis())) {
            kasaHareketleriService.createKasaHareketi(satis.getToplamTutar(), SATIS_GUNCELLEMESI);
        }
        if (Boolean.FALSE.equals(satisOncekiHali.isKartliSatis()) && Boolean.TRUE.equals(satis.isKartliSatis())) {
            kasaHareketleriService.createKasaHareketi(satis.getToplamTutar().negate(), SATIS_GUNCELLEMESI);
        }
    }

    private void makeStokUpdates(Set<SatisStokHareketleri> stokHareketleriLists) {
        for (SatisStokHareketleri satisStokHareketi : stokHareketleriLists) {
            Urun urun = satisStokHareketi.getUrun();
            if (satisStokHareketi.getUrun().getStok() != null) {
                if (satisStokHareketi.getId() != null) {
                    Optional<SatisStokHareketleri> oncekiSatisStokHareketiOptional = satisStokHareketleriRepository.findById(
                        satisStokHareketi.getId()
                    );
                    SatisStokHareketleri oncekiSatisStokHareketi = oncekiSatisStokHareketiOptional.orElseThrow(
                        SatisNotFoundUsedException::new
                    );
                    int stokDegisimi = oncekiSatisStokHareketi.getMiktar() - satisStokHareketi.getMiktar();
                    urun.setStok(urun.getStok().add(BigDecimal.valueOf(stokDegisimi)));
                } else {
                    urun.setStok(urun.getStok().add(BigDecimal.valueOf(satisStokHareketi.getMiktar())));
                }
            }
        }
    }

    public Page<Satis> search(String query, Pageable pageable) {
        return satisRepository.findSatisByLogin(query, pageable);
    }
}
