package com.koop.app.web.rest;

import com.koop.app.domain.Uretici;
import com.koop.app.dto.Ciro;
import com.koop.app.dto.CiroRequest;
import com.koop.app.service.ReportService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * REST controller for managing {@link Uretici}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ReportsResource {

    private final Logger log = LoggerFactory.getLogger(ReportsResource.class);
    private final ReportService reportService;
    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    public ReportsResource(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping(params = {"fromDate", "toDate"}, path = "/reports/ciro")
    public ResponseEntity<List<Ciro>> getCiroReport(@RequestParam(value = "fromDate") LocalDate fromDate,
                                                    @RequestParam(value = "toDate") LocalDate toDate) {
        log.debug("REST request to get ciro report");
        return ResponseEntity.ok().body(reportService.getCiroReport(fromDate, toDate));
    }
}
