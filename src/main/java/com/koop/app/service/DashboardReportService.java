package com.koop.app.service;

import com.koop.app.domain.DashboardReports;
import com.koop.app.domain.KasaHareketleri;
import com.koop.app.dto.Ciro;
import com.koop.app.repository.KasaHareketleriRepository;
import com.koop.app.repository.SatisRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class DashboardReportService {
    private final SatisRepository satisRepository;

    private final KasaHareketleriRepository kasaHareketleriRepository;

    private final UreticiOdemeleriService ureticiOdemeleriService;

    public DashboardReportService(
        SatisRepository satisRepository,
        KasaHareketleriRepository kasaHareketleriRepository, UreticiOdemeleriService ureticiOdemeleriService) {
        this.satisRepository = satisRepository;
        this.kasaHareketleriRepository = kasaHareketleriRepository;
        this.ureticiOdemeleriService = ureticiOdemeleriService;
    }

    public DashboardReports getDashboardReports() {
        DashboardReports dashboardReports = new DashboardReports();
        KasaHareketleri lastOrderByTarih = kasaHareketleriRepository.findFirstByOrderByTarihDesc();
        dashboardReports.setKasadaNeVar(lastOrderByTarih.getKasaMiktar().doubleValue());

        ZonedDateTime endOfDay = LocalDate.now().plusDays(1).atStartOfDay(ZoneId.systemDefault());
        ZonedDateTime startOfDay = LocalDate.now().atStartOfDay(ZoneId.systemDefault());
        Double bugununSatisi = satisRepository.findCiro(endOfDay, startOfDay);
        Double kartliSatis = satisRepository.findCiroKartli(endOfDay, startOfDay);
        if (bugununSatisi != null) {
            dashboardReports.setGunlukCiro(bugununSatisi);
            if (kartliSatis == null) {
                kartliSatis = 0d;
            }
            dashboardReports.setKartliSatis(kartliSatis);
            dashboardReports.setNakitSatis(bugununSatisi - kartliSatis);
        }

        LocalDate from = LocalDate.now().minusDays(7);
        LocalDate to = LocalDate.now();
        List<Ciro> ciroReports = satisRepository.getCiroReports(
            from.atStartOfDay(ZoneId.systemDefault()),
            to.plusDays(1).atStartOfDay(ZoneId.systemDefault())
        );

        List<BigDecimal> ciroRakamlari = ciroReports.stream().map(Ciro::getTutar).collect(Collectors.toList());
        List<String> ciroTarihleri = ciroReports.stream().map(ciro -> ciro.getTarih().toString()).collect(Collectors.toList());
        dashboardReports.setHaftalikCiroRakamlari(ciroRakamlari);
        dashboardReports.setHaftalikCiroTarihleri(ciroTarihleri);

        dashboardReports.setToplamBorc(ureticiOdemeleriService.findTotalBorc().doubleValue());

        return dashboardReports;
    }

    public DashboardReports getDashboardReportsByDay(LocalDate localDate) {
        DashboardReports dashboardReports = new DashboardReports();
        ZonedDateTime endOfDay = localDate.plusDays(1).atStartOfDay(ZoneId.systemDefault());
        ZonedDateTime startOfDay = localDate.atStartOfDay(ZoneId.systemDefault());

        KasaHareketleri lastOrderByTarih = kasaHareketleriRepository.findFirstByOrderByTarihDesc(endOfDay);
        dashboardReports.setKasadaNeVar(lastOrderByTarih.getKasaMiktar().doubleValue());

        Double bugununSatisi = satisRepository.findCiro(endOfDay, startOfDay);
        Double kartliSatis = satisRepository.findCiroKartli(endOfDay, startOfDay);
        if (bugununSatisi != null) {
            dashboardReports.setGunlukCiro(bugununSatisi);
            if (kartliSatis == null) {
                kartliSatis = 0d;
            }
            dashboardReports.setKartliSatis(kartliSatis);
            dashboardReports.setNakitSatis(bugununSatisi - kartliSatis);
        }

        return dashboardReports;
    }
}
