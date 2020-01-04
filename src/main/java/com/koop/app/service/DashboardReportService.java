package com.koop.app.service;

import com.koop.app.domain.DashboardReports;
import com.koop.app.domain.Satis;
import com.koop.app.repository.GiderRepository;
import com.koop.app.repository.SatisRepository;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;

@Service
public class DashboardReportService {

    private final SatisRepository satisRepository;

    private final GiderRepository giderRepository;

    public DashboardReportService(SatisRepository satisRepository, GiderRepository giderRepository) {
        this.satisRepository = satisRepository;
        this.giderRepository = giderRepository;
    }

    public DashboardReports getDashboardReports() {
        DashboardReports dashboardReports = new DashboardReports();
        ZonedDateTime today = ZonedDateTime.now();
        ZonedDateTime yesterday = ZonedDateTime.now()
            .plusDays(-1);

        List<Integer> allIdsToday = satisRepository.findAllIdsToday(today, yesterday);
        List<Satis> allByIds = satisRepository.findAllByIds(allIdsToday);
        double bugununSatisi = allByIds
        Double bugununGideri = giderRepository.findBugununGideri(today, yesterday);
        dashboardReports.setKasadaNeVar(bugununSatisi - bugununGideri);

        dashboardReports.setParameterCheckResultSuccessCount(parameterCheckResultRepository.findYesterdaySuccess(today, yesterday));

        dashboardReports.setCollectorResultFailCount(collectorResultRepository.findYesterdayFail(today, yesterday));
        dashboardReports.setCollectorResultSuccessCount(collectorResultRepository.findYesterdaySuccess(today, yesterday));

        return dashboardReports;
    }
}
