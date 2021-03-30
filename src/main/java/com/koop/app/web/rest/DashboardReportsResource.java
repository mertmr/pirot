package com.koop.app.web.rest;

import com.koop.app.domain.DashboardReports;
import com.koop.app.service.DashboardReportService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class DashboardReportsResource {

    private final Logger log = LoggerFactory.getLogger(DashboardReportsResource.class);

    private final DashboardReportService dashboardReportService;

    public DashboardReportsResource(DashboardReportService dashboardReportService) {
        this.dashboardReportService = dashboardReportService;
    }

    @GetMapping("/dashboard-reports")
    public ResponseEntity<DashboardReports> getDa1shboardReports() {
        log.debug("REST request to get Dashboard Reports");
        return ResponseEntity.ok().body(dashboardReportService.getDashboardReports());
    }
}
