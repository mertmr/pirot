package com.koop.app.service;

import com.koop.app.domain.*;
import com.koop.app.domain.enumeration.Birim;
import com.koop.app.dto.Ciro;
import com.koop.app.dto.fatura.*;
import com.koop.app.repository.*;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class ReportService {
    private final SatisRepository satisRepository;

    private final SatisStokHareketleriRepository satisStokHareketleriRepository;

    private final KdvKategorisiRepository kdvKategorisiRepository;

    private final VirmanRepository virmanRepository;

    private final GiderRepository giderRepository;

    private final DashboardReportService dashboardReportService;

    private final NobetHareketleriRepository nobetHareketleriRepository;

    public ReportService(
        SatisRepository satisRepository,
        SatisStokHareketleriRepository satisStokHareketleriRepository,
        KdvKategorisiRepository kdvKategorisiRepository,
        VirmanRepository virmanRepository,
        GiderRepository giderRepository,
        DashboardReportService dashboardReportService,
        NobetHareketleriRepository nobetHareketleriRepository
    ) {
        this.satisRepository = satisRepository;
        this.satisStokHareketleriRepository = satisStokHareketleriRepository;
        this.kdvKategorisiRepository = kdvKategorisiRepository;
        this.virmanRepository = virmanRepository;
        this.giderRepository = giderRepository;
        this.dashboardReportService = dashboardReportService;
        this.nobetHareketleriRepository = nobetHareketleriRepository;
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

    public Ciro getCiroReportGroupByNobetciAndDate(LocalDate fromDate, Long userId) {
        return satisRepository.getCiroReportGroupByNobetciAndDate(
            fromDate.atStartOfDay(ZoneId.systemDefault()),
            fromDate.plusDays(1).atStartOfDay(ZoneId.systemDefault()),
            userId
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

        List<OrtakFaturaDbReport> ortakFaturaDbReports = satisStokHareketleriRepository.ortakFaturaKisiAy(
            year,
            month,
            kisiId
        );

        List<OrtakFaturasiDetayDto> ortakFaturasiList = new ArrayList<>();
        for (OrtakFaturaDbReport ortakFaturaDbReport : ortakFaturaDbReports) {
            OrtakFaturasiDetayDto ortakFaturasi = new OrtakFaturasiDetayDto();
            ortakFaturasi.setUrunAdiKdv(ortakFaturaDbReport.getUrunIsmi());
            ortakFaturasi.setKdvKategorisi(ortakFaturaDbReport.getKdvKategorisi());
            double kdvOrani = ortakFaturaDbReport.getUrun().getKdvKategorisi().getKdvOrani();
            if (ortakFaturaDbReport.getUrun().getBirim() == Birim.GRAM) {
                BigDecimal miktar = BigDecimal
                    .valueOf(ortakFaturaDbReport.getMiktar())
                    .multiply(BigDecimal.valueOf(0.001))
                    .setScale(3, RoundingMode.HALF_UP);
                ortakFaturasi.setMiktar(miktar + " KG");
                BigDecimal birimFiyat = ortakFaturaDbReport.getToplamTutar().divide(miktar, 2, RoundingMode.HALF_UP);
                ortakFaturasi.setBirimFiyat(kdvsizFiyatHesapla(kdvOrani, birimFiyat));
                ortakFaturasi.setToplamTutar(ortakFaturasi.getBirimFiyat()
                    .multiply(miktar).setScale(2, RoundingMode.HALF_UP)); //set kdv without
            } else {
                ortakFaturasi.setMiktar(
                    ortakFaturaDbReport.getMiktar() + " " + ortakFaturaDbReport.getUrun().getBirim()
                );
                BigDecimal birimFiyat = ortakFaturaDbReport
                    .getToplamTutar()
                    .divide(BigDecimal.valueOf(ortakFaturaDbReport.getMiktar()), 2, RoundingMode.HALF_UP);
                ortakFaturasi.setBirimFiyat(kdvsizFiyatHesapla(kdvOrani, birimFiyat));
                ortakFaturasi.setToplamTutar(ortakFaturasi.getBirimFiyat()
                    .multiply(BigDecimal.valueOf(ortakFaturaDbReport.getMiktar())).setScale(2, RoundingMode.HALF_UP)); //set kdv without
            }

            ortakFaturasiList.add(ortakFaturasi);
        }

        OrtakFaturasiDto ortakFaturasiDto = new OrtakFaturasiDto();
        ortakFaturasiDto.setOrtakFaturasiDetayDto(ortakFaturasiList);

        List<KdvKategorisi> kdvKategorisiList = kdvKategorisiRepository.findAll();
        List<KdvToplam> kdvToplamList = new ArrayList<>();
        for (KdvKategorisi kdvKategorisi : kdvKategorisiList) {
            List<OrtakFaturasiDetayDto> ortakFaturaDbReportListKdv = ortakFaturasiList
                .stream()
                .filter(
                    ortakFaturaDbReport -> ortakFaturaDbReport.getKdvKategorisi().getId().equals(kdvKategorisi.getId())
                )
                .collect(Collectors.toList());
            KdvToplam kdvToplam = new KdvToplam();
            double kdvSum = ortakFaturaDbReportListKdv
                .stream()
                .mapToDouble(
                    ortakFaturaDbReport ->
                        ortakFaturaDbReport.getToplamTutar().doubleValue() * kdvKategorisi.getKdvOrani() * 0.01D
                )
                .sum();
            kdvToplam.setKdvKategorisi(kdvKategorisi.getKategoriAdi());
            kdvToplam.setKdvTutari(BigDecimal.valueOf(kdvSum).setScale(2, RoundingMode.HALF_UP));
            kdvToplamList.add(kdvToplam);
        }
        ortakFaturasiDto.setKdvToplamList(kdvToplamList);
        double tumKdvToplami = kdvToplamList
            .stream()
            .mapToDouble(kdvToplam -> kdvToplam.getKdvTutari().setScale(2, RoundingMode.HALF_UP).doubleValue())
            .sum();
        ortakFaturasiDto.setTumKdvToplami(tumKdvToplami);
        double tumToplamKdvHaric = ortakFaturasiList
            .stream()
            .mapToDouble(ortakFaturasi -> ortakFaturasi.getToplamTutar().doubleValue())
            .sum();
        tumToplamKdvHaric = BigDecimal.valueOf(tumToplamKdvHaric).setScale(2, RoundingMode.HALF_UP).doubleValue();
        ortakFaturasiDto.setTumToplamKdvHaric(tumToplamKdvHaric);
        double tumToplam = BigDecimal.valueOf(tumKdvToplami + tumToplamKdvHaric)
            .setScale(2, RoundingMode.HALF_UP).doubleValue();
        ortakFaturasiDto.setTumToplam(tumToplam);

        return ortakFaturasiDto;
    }

    private BigDecimal kdvsizFiyatHesapla(double kdvOrani, BigDecimal fiyat) {
        return fiyat
            .divide(BigDecimal.valueOf(100 + kdvOrani), 5, RoundingMode.HALF_UP)
            .multiply(BigDecimal.valueOf(100))
            .setScale(2, RoundingMode.HALF_UP);
    }

    public GunSonuRaporuDto gunSonuRaporu(LocalDate localDate) {
        List<Gider> giderList = giderRepository.findGiderByGun(
            localDate.atStartOfDay(ZoneId.systemDefault()),
            localDate.plusDays(1).atStartOfDay(ZoneId.systemDefault())
        );
        Virman virman = virmanRepository.findVirmanByGun(
            localDate.atStartOfDay(ZoneId.systemDefault()),
            localDate.plusDays(1).atStartOfDay(ZoneId.systemDefault())
        );
        DashboardReports dashboardReports = dashboardReportService.getDashboardReportsByDay(localDate);
        ZonedDateTime endOfDay = localDate.plusDays(1).atStartOfDay(ZoneId.systemDefault());

        NobetHareketleri lastNobetHareketiByTarih = nobetHareketleriRepository.findLastNobetHareketiByTarih(endOfDay);
        NobetHareketleri acilisHareketi = nobetHareketleriRepository.findLastNobetHareketiAcilisByTarih(
            localDate.atStartOfDay(ZoneId.systemDefault()),
            localDate.plusDays(1).atStartOfDay(ZoneId.systemDefault()),
            lastNobetHareketiByTarih.getUser().getId()
        );

        GunSonuRaporuDto gunSonuRaporuDto = new GunSonuRaporuDto();
        gunSonuRaporuDto.setGiderList(giderList);
        gunSonuRaporuDto.setVirman(virman);
        gunSonuRaporuDto.setDashboardReports(dashboardReports);
        gunSonuRaporuDto.setNobetHareketleri(lastNobetHareketiByTarih);
        gunSonuRaporuDto.setAcilisHareketi(acilisHareketi);
        return gunSonuRaporuDto;
    }
}
