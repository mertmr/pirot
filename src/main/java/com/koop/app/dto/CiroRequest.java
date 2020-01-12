package com.koop.app.dto;

import java.time.ZonedDateTime;

public class CiroRequest {

    private ZonedDateTime to;

    private ZonedDateTime from;

    public ZonedDateTime getTo() {
        return to;
    }

    public void setTo(ZonedDateTime to) {
        this.to = to;
    }

    public ZonedDateTime getFrom() {
        return from;
    }

    public void setFrom(ZonedDateTime from) {
        this.from = from;
    }
}
