package com.koop.app.service;

import com.koop.app.domain.DashboardReports;
import com.koop.app.domain.KasaHareketleri;
import com.koop.app.repository.KasaHareketleriRepository;
import com.koop.app.repository.SatisRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Service
public class DashboardReportService {

    private final SatisRepository satisRepository;

    private final KasaHareketleriRepository kasaHareketleriRepository;

    public DashboardReportService(SatisRepository satisRepository, KasaHareketleriRepository kasaHareketleriRepository) {
        this.satisRepository = satisRepository;
        this.kasaHareketleriRepository = kasaHareketleriRepository;
    }

    public DashboardReports getDashboardReports() {
        DashboardReports dashboardReports = new DashboardReports();
        KasaHareketleri lastOrderByTarih = kasaHareketleriRepository.findFirstByOrderByTarihDesc();
        dashboardReports.setKasadaNeVar(lastOrderByTarih.getKasaMiktar().doubleValue());

        ZonedDateTime endOfDay = LocalDate.now().plusDays(1).atStartOfDay(ZoneId.systemDefault());
        ZonedDateTime startOfDay = LocalDate.now().atStartOfDay(ZoneId.systemDefault());
        Double bugununSatisi = satisRepository.findCiro(endOfDay, startOfDay);
        if (bugununSatisi != null) {
            dashboardReports.setGunlukCiro(bugununSatisi);
        }

        return dashboardReports;
    }
}
