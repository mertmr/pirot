package com.koop.app.service;

import org.jobrunr.scheduling.JobScheduler;
import org.springframework.stereotype.Service;

@Service
public class JobService {

    private final JobScheduler jobScheduler;
    private final MaliService maliService;

    public JobService(JobScheduler jobScheduler, MaliService maliService) {
        this.jobScheduler = jobScheduler;
        this.maliService = maliService;
        scheduleJobs();
    }

    public void scheduleJobs() {
        jobScheduler.scheduleRecurrently("0 10 23 28-31 * *", maliService::sendStockMail);
    }
}
