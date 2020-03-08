package com.koop.app.service;

import com.koop.app.dto.Ciro;
import com.koop.app.repository.SatisRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ReportService {
    private final SatisRepository satisRepository;

    public ReportService(SatisRepository satisRepository) {
        this.satisRepository = satisRepository;
    }

    public List<Ciro> getCiroReport(LocalDate from, LocalDate to) {
        return satisRepository.getCiroReports(
            from.atStartOfDay(ZoneId.systemDefault()),
            to.plusDays(1).atStartOfDay(ZoneId.systemDefault())
        );
    }
}
