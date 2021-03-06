package com.koop.app.web.rest;

import com.koop.app.domain.Kisiler;
import com.koop.app.domain.StokGirisi;
import com.koop.app.domain.Uretici;
import com.koop.app.domain.Urun;
import com.koop.app.dto.Ciro;
import com.koop.app.dto.UrunTukenmeDTO;
import com.koop.app.dto.fatura.GunSonuRaporuDto;
import com.koop.app.dto.fatura.OrtakFaturasiDto;
import com.koop.app.dto.fatura.ReportDatesDto;
import com.koop.app.service.ReportService;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller for managing {@link Uretici}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ReportsResource {
    private final Logger log = LoggerFactory.getLogger(ReportsResource.class);
    private final ReportService reportService;

    public ReportsResource(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping(params = { "fromDate", "toDate" }, path = "/reports/ciro")
    public ResponseEntity<List<Ciro>> getCiroReport(
        @RequestParam(value = "fromDate") LocalDate fromDate,
        @RequestParam(value = "toDate") LocalDate toDate
    ) {
        log.debug("REST request to get ciro report");
        return ResponseEntity.ok().body(reportService.getCiroReport(fromDate, toDate));
    }

    @GetMapping(params = { "fromDate" }, path = "/reports/ciro/by-nobetci")
    public ResponseEntity<List<Ciro>> getCiroReportGroupByNobetci(
        @RequestParam(value = "fromDate") LocalDate fromDate
    ) {
        log.debug("REST request to get ciro report by nobetci");
        return ResponseEntity.ok().body(reportService.getCiroReportGroupByNobetci(fromDate));
    }

    @GetMapping(params = { "fromDate", "userId" }, path = "/reports/ciro/nobetci-date")
    public ResponseEntity<Ciro> getCiroReportGroupByNobetciAndDate(
        @RequestParam(value = "fromDate") String fromDate,
        @RequestParam(value = "userId") Long userId
    ) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate localDate = LocalDate.parse(fromDate, formatter);
        log.debug("REST request to get ciro report by nobetci and date");
        return ResponseEntity.ok().body(reportService.getCiroReportGroupByNobetciAndDate(localDate, userId));
    }

    @GetMapping("/reports/report-date-list")
    public ResponseEntity<List<ReportDatesDto>> getOrtaklarFaturaDates() {
        log.debug("REST request to get report date list");
        return ResponseEntity.ok().body(reportService.getOrtaklarFaturaDates());
    }

    @GetMapping("/reports/ortak-fatura-kisi-list")
    public ResponseEntity<List<Kisiler>> ortakFaturaKisiList(@RequestParam(value = "reportDate") String reportDate) {
        log.debug("REST request to get report date list");
        return ResponseEntity.ok().body(reportService.ortakFaturaKisiList(reportDate));
    }

    @GetMapping("/reports/ortak-fatura-kisi-ay")
    public ResponseEntity<OrtakFaturasiDto> ortakFaturaKisiAy(
        @RequestParam(value = "reportDate") String reportDate,
        @RequestParam(value = "kisiId") Long kisiId
    ) {
        log.debug("REST request to get report date list");
        return ResponseEntity.ok().body(reportService.ortakFaturaKisiAy(reportDate, kisiId));
    }

    @GetMapping("/reports/gun-sonu-raporu")
    public ResponseEntity<GunSonuRaporuDto> gunSonuRaporu(@RequestParam(value = "reportDate") String fromDate) {
        log.debug("REST request to get gun sonu raporu");
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate localDate = LocalDate.parse(fromDate, formatter);
        return ResponseEntity.ok().body(reportService.gunSonuRaporu(localDate));
    }

    @GetMapping("/reports/urunTukenmeHizi")
    public ResponseEntity<UrunTukenmeDTO> urunTukenmeHizi(@RequestParam(value = "urunId") Long urunId, @RequestParam(value = "stokGirisiDate") String stokGirisiDate) {
        UrunTukenmeDTO urunTukenmeDTO = reportService.urunTukenmeHizi(urunId, stokGirisiDate);
        return ResponseEntity.ok().body(urunTukenmeDTO);
    }
}
