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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @GetMapping("/reports/ciro")
    public ResponseEntity<List<Ciro>> getCiroReport(CiroRequest ciroRequest) {
        log.debug("REST request to get ciro report");
        return ResponseEntity.ok().body(reportService.getCiroReport(ciroRequest));
    }
}
