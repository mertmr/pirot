package com.koop.app.dto;

import java.time.LocalDate;

public class CiroRequest {

    private LocalDate to;

    private LocalDate from;

    public LocalDate getTo() {
        return to;
    }

    public void setTo(LocalDate to) {
        this.to = to;
    }

    public LocalDate getFrom() {
        return from;
    }

    public void setFrom(LocalDate from) {
        this.from = from;
    }
}
