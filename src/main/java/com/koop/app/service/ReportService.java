package com.koop.app.service;

import com.koop.app.domain.KdvKategorisi;
import com.koop.app.domain.Kisiler;
import com.koop.app.domain.enumeration.Birim;
import com.koop.app.dto.Ciro;
import com.koop.app.dto.fatura.*;
import com.koop.app.repository.KdvKategorisiRepository;
import com.koop.app.repository.SatisRepository;
import com.koop.app.repository.SatisStokHareketleriRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final SatisRepository satisRepository;

    private final SatisStokHareketleriRepository satisStokHareketleriRepository;

    private final KdvKategorisiRepository kdvKategorisiRepository;

    public ReportService(SatisRepository satisRepository, SatisStokHareketleriRepository satisStokHareketleriRepository, KdvKategorisiRepository kdvKategorisiRepository) {
        this.satisRepository = satisRepository;
        this.satisStokHareketleriRepository = satisStokHareketleriRepository;
        this.kdvKategorisiRepository = kdvKategorisiRepository;
    }

    public List<Ciro> getCiroReport(LocalDate from, LocalDate to) {
        return satisRepository.getCiroReports(
            from.atStartOfDay(ZoneId.systemDefault()),
            to.plusDays(1).atStartOfDay(ZoneId.systemDefault())
        );
    }

    public List<Ciro> getCiroReportGroupByNobetci(LocalDate localDate) {
        return satisRepository.getCiroReportGroupByNobetci(
            localDate.atStartOfDay(ZoneId.systemDefault()),
            localDate.plusDays(1).atStartOfDay(ZoneId.systemDefault())
        );
    }

    public List<ReportDatesDto> getOrtaklarFaturaDates() {
        return satisRepository.getOrtaklarFaturaDatesTop10(PageRequest.of(0, 10));
    }

    public List<Kisiler> ortakFaturaKisiList(String reportDate) {
        String year = reportDate.split("-")[0];
        String month = reportDate.split("-")[1];
        return satisRepository.ortakFaturaKisiList(Integer.parseInt(year), Integer.parseInt(month));
    }

    public OrtakFaturasiDto ortakFaturaKisiAy(String reportDate, Long kisiId) {
        int year = Integer.parseInt(reportDate.split("-")[0]);
        int month = Integer.parseInt(reportDate.split("-")[1]);

        List<OrtakFaturaDbReport> ortakFaturaDbReports = satisStokHareketleriRepository.ortakFaturaKisiAy(year, month, kisiId);

        List<OrtakFaturasiDetayDto> ortakFaturasiList = new ArrayList<>();
        for (OrtakFaturaDbReport ortakFaturaDbReport : ortakFaturaDbReports) {
            OrtakFaturasiDetayDto ortakFaturasi = new OrtakFaturasiDetayDto();
            ortakFaturasi.setUrunAdiKdv(ortakFaturaDbReport.getUrunIsmi());
            if (ortakFaturaDbReport.getUrun().getBirim() == Birim.GRAM) {
                BigDecimal miktar = BigDecimal.valueOf(ortakFaturaDbReport.getMiktar()).multiply(BigDecimal.valueOf(0.001)).setScale(3, RoundingMode.HALF_UP);
                ortakFaturasi.setMiktar(miktar + " KG");
                ortakFaturasi.setBirimFiyat(ortakFaturaDbReport.getToplamTutar()
                    .divide(miktar, 2, RoundingMode.HALF_UP));
            } else {
                ortakFaturasi.setMiktar(ortakFaturaDbReport.getMiktar() + " " + ortakFaturaDbReport.getUrun().getBirim());
                ortakFaturasi.setBirimFiyat(ortakFaturaDbReport.getToplamTutar()
                    .divide(BigDecimal.valueOf(ortakFaturaDbReport.getMiktar()), 2, RoundingMode.HALF_UP));
            }

            double kdvOrani = ortakFaturaDbReport.getUrun().getKdvKategorisi().getKdvOrani() * 0.01;
            ortakFaturasi.setToplamTutar(ortakFaturaDbReport.getToplamTutar().multiply(BigDecimal.valueOf(1 - kdvOrani))); //set kdv without
            ortakFaturasiList.add(ortakFaturasi);
        }

        OrtakFaturasiDto ortakFaturasiDto = new OrtakFaturasiDto();
        ortakFaturasiDto.setOrtakFaturasiDetayDto(ortakFaturasiList);

        List<KdvKategorisi> kdvKategorisiList = kdvKategorisiRepository.findAll();
        List<KdvToplam> kdvToplamList = new ArrayList<>();
        for (KdvKategorisi kdvKategorisi : kdvKategorisiList) {
            List<OrtakFaturaDbReport> ortakFaturaDbReportListKdv = ortakFaturaDbReports.stream()
                .filter(ortakFaturaDbReport -> ortakFaturaDbReport.getKdvKategorisi().getId().equals(kdvKategorisi.getId()))
                .collect(Collectors.toList());
            KdvToplam kdvToplam = new KdvToplam();
            double kdvSum = ortakFaturaDbReportListKdv.stream()
                .mapToDouble(ortakFaturaDbReport -> ortakFaturaDbReport.getToplamTutar().doubleValue() * kdvKategorisi.getKdvOrani() * 0.01D)
                .sum();
            kdvToplam.setKdvKategorisi(kdvKategorisi.getKategoriAdi());
            kdvToplam.setKdvTutari(BigDecimal.valueOf(kdvSum).setScale(2, RoundingMode.HALF_UP));
            kdvToplamList.add(kdvToplam);
        }
        ortakFaturasiDto.setKdvToplamList(kdvToplamList);
        double tumKdvToplami = kdvToplamList.stream().mapToDouble(kdvToplam -> kdvToplam.getKdvTutari().setScale(2, RoundingMode.HALF_UP).doubleValue()).sum();
        ortakFaturasiDto.setTumKdvToplami(tumKdvToplami);
        double tumToplam = ortakFaturaDbReports.stream().mapToDouble(ortakFaturaDbReport -> ortakFaturaDbReport.getToplamTutar().doubleValue()).sum();
        ortakFaturasiDto.setTumToplamKdvHaric(BigDecimal.valueOf(tumToplam - tumKdvToplami).setScale(2, RoundingMode.HALF_UP).doubleValue());
        ortakFaturasiDto.setTumToplam(tumToplam);

        return ortakFaturasiDto;
    }
}
