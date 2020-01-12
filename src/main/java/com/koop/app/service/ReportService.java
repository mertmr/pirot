package com.koop.app.service;

import com.koop.app.dto.Ciro;
import com.koop.app.dto.CiroRequest;
import com.koop.app.repository.SatisRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

@Service
public class ReportService {

    private final SatisRepository satisRepository;

    public ReportService(SatisRepository satisRepository) {
        this.satisRepository = satisRepository;
    }

    public List<Ciro> getCiroReport(CiroRequest ciroRequest) {
        ZonedDateTime endOfDay = LocalDate.now().plusDays(1).atStartOfDay(ZoneId.systemDefault());
        ZonedDateTime startOfDay = LocalDate.now().atStartOfDay(ZoneId.systemDefault());
        ciroRequest.setFrom(startOfDay);
        ciroRequest.setTo(endOfDay);
        return satisRepository.getCiroReports(ciroRequest.getFrom(), ciroRequest.getTo());
    }
}
