package com.koop.app.service;

import com.koop.app.domain.DashboardReports;
import com.koop.app.domain.Satis;
import com.koop.app.domain.SatisStokHareketleri;
import com.koop.app.repository.GiderRepository;
import com.koop.app.repository.SatisRepository;
import com.koop.app.repository.SatisStokHareketleriRepository;
import com.koop.app.repository.VirmanRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

@Service
public class DashboardReportService {

    private final SatisRepository satisRepository;

    private final GiderRepository giderRepository;

    private final SatisStokHareketleriRepository satisStokHareketleriRepository;

    private final VirmanRepository virmanRepository;

    public DashboardReportService(SatisRepository satisRepository, GiderRepository giderRepository, SatisStokHareketleriRepository satisStokHareketleriRepository, VirmanRepository virmanRepository) {
        this.satisRepository = satisRepository;
        this.giderRepository = giderRepository;
        this.satisStokHareketleriRepository = satisStokHareketleriRepository;
        this.virmanRepository = virmanRepository;
    }

    public DashboardReports getDashboardReports() {
        DashboardReports dashboardReports = new DashboardReports();
        Double tumGiderTutari = giderRepository.findAllGiderTutar();
        Double tumSatisTutari = satisStokHareketleriRepository.findAllTutar();
        Double tumVirman = virmanRepository.findAllVirman();
        dashboardReports.setKasadaNeVar(tumSatisTutari - tumGiderTutari - tumVirman);

        ZonedDateTime endOfDay = LocalDate.now().plusDays(1).atStartOfDay(ZoneId.systemDefault());
        ZonedDateTime startOfDay = LocalDate.now().atStartOfDay(ZoneId.systemDefault());
        double bugununSatisi = getBugununSatisi(endOfDay, startOfDay);
        dashboardReports.setGunlukCiro(bugununSatisi);

        return dashboardReports;
    }

    private double getBugununSatisi(ZonedDateTime today, ZonedDateTime yesterday) {
        double bugununSatisi = 0;
        List<Long> allIdsToday = satisRepository.findAllIdsToday(today, yesterday);
        if (allIdsToday.isEmpty()) {
            return bugununSatisi;
        } else {
            List<Satis> allByIds = satisRepository.findAllByIds(allIdsToday);
            for (Satis satis : allByIds) {
                for (SatisStokHareketleri stokHareketi : satis.getStokHareketleriLists()) {
                    bugununSatisi += stokHareketi.getTutar().doubleValue();
                }
            }
            return bugununSatisi;
        }
    }
}
