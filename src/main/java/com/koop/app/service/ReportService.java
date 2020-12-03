package com.koop.app.service;

import com.koop.app.domain.*;
import com.koop.app.domain.enumeration.Birim;
import com.koop.app.dto.Ciro;
import com.koop.app.dto.UrunTukenmeDTO;
import com.koop.app.dto.fatura.*;
import com.koop.app.repository.*;
import com.koop.app.service.error.InsufficientDataException;
import org.javers.core.Javers;
import org.javers.core.diff.Change;
import org.javers.core.diff.changetype.ValueChange;
import org.javers.repository.jql.QueryBuilder;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {
    private final SatisRepository satisRepository;

    private final SatisStokHareketleriRepository satisStokHareketleriRepository;

    private final KdvKategorisiRepository kdvKategorisiRepository;

    private final VirmanRepository virmanRepository;

    private final GiderRepository giderRepository;

    private final DashboardReportService dashboardReportService;

    private final NobetHareketleriRepository nobetHareketleriRepository;

    private final StokGirisiRepository stokGirisiRepository;

    private final Javers javers;

    public ReportService(
        SatisRepository satisRepository,
        SatisStokHareketleriRepository satisStokHareketleriRepository,
        KdvKategorisiRepository kdvKategorisiRepository,
        VirmanRepository virmanRepository,
        GiderRepository giderRepository,
        DashboardReportService dashboardReportService,
        NobetHareketleriRepository nobetHareketleriRepository,
        StokGirisiRepository stokGirisiRepository, Javers javers) {
        this.satisRepository = satisRepository;
        this.satisStokHareketleriRepository = satisStokHareketleriRepository;
        this.kdvKategorisiRepository = kdvKategorisiRepository;
        this.virmanRepository = virmanRepository;
        this.giderRepository = giderRepository;
        this.dashboardReportService = dashboardReportService;
        this.nobetHareketleriRepository = nobetHareketleriRepository;
        this.stokGirisiRepository = stokGirisiRepository;
        this.javers = javers;
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
                if (ortakFaturaDbReport.getMiktar() == 0L)
                    continue;
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
            .mapToDouble(kdvToplam -> kdvToplam.getKdvTutari().doubleValue())
            .sum();
        tumKdvToplami = BigDecimal.valueOf(tumKdvToplami).setScale(2, RoundingMode.HALF_UP).doubleValue();
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

    public UrunTukenmeDTO urunTukenmeHizi(Long urunId, String stokDate) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
            LocalDateTime localDate = LocalDateTime.parse(stokDate, formatter);
            LocalDateTime from = localDate.minusSeconds(5);
            LocalDateTime to = localDate.plusMonths(1);

            QueryBuilder jqlQuery = QueryBuilder.byInstanceId(urunId, Urun.class).withChangedProperty("stok").limit(1000).from(from).to(to);
            List<Change> changes = javers.findChanges(jqlQuery.build());
            ValueChange firstChange = (ValueChange) changes.get(changes.size() - 1);
            BigDecimal ilkStok = (BigDecimal) firstChange.getRight();
            BigDecimal limitStok = ilkStok.multiply(BigDecimal.valueOf(0.05));
            ValueChange underLimit = null;
            UrunTukenmeDTO urunTukenmeDTO = new UrunTukenmeDTO();
            for (int i = changes.size() - 2; i >= 0; i--) {
                Change change = changes.get(i);
                ValueChange stokDegisikligi = (ValueChange) change;
                BigDecimal stokDegisikligiMiktari = (BigDecimal) stokDegisikligi.getRight();
                BigDecimal oncekiHali = (BigDecimal) stokDegisikligi.getLeft();

                if (stokDegisikligiMiktari.compareTo(oncekiHali) > 0) {
                    underLimit = (ValueChange) changes.get(i + 1);
                    break;
                }

                if (stokDegisikligiMiktari.compareTo(limitStok) <= 0) {
                    underLimit = stokDegisikligi;
                    break;
                }
            }

            if (underLimit == null) {
                underLimit = (ValueChange) changes.get(0);
            }
            LocalDateTime stokBittiTarihi = underLimit.getCommitMetadata().get().getCommitDate();
            ZonedDateTime stokBittiTarihiZoned = stokBittiTarihi.atZone(ZoneId.systemDefault());
            LocalDateTime ilkStokGirisTarihi = firstChange.getCommitMetadata().get().getCommitDate();
            ZonedDateTime ilkStokGirisTarihiZoned = ilkStokGirisTarihi.atZone(ZoneId.systemDefault());
            long durationInDays = Duration.between(ilkStokGirisTarihi, stokBittiTarihi).toDays();
            urunTukenmeDTO.setRaporVeriOlcekSuresi(BigDecimal.valueOf(durationInDays));

            List<SatisStokHareketleri> satisRaporlariByUrunAndTarih = satisStokHareketleriRepository
                .getSatisRaporlariByUrunAndTarih(ilkStokGirisTarihiZoned, stokBittiTarihiZoned, urunId);
            urunTukenmeDTO.setStokGunluguList(satisRaporlariByUrunAndTarih);
            long satisRaporlariToplamiByUrunAndTarih = satisStokHareketleriRepository
                .getSatisRaporlariToplamiByUrunAndTarih(ilkStokGirisTarihiZoned, stokBittiTarihiZoned, urunId);
            BigDecimal urununAylikTukenmeMiktari = BigDecimal.valueOf(satisRaporlariToplamiByUrunAndTarih)
                .divide(BigDecimal.valueOf(durationInDays), 2, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(30));
            urunTukenmeDTO.setAylikTukenmeHizi(urununAylikTukenmeMiktari);
            urunTukenmeDTO.setHaftalikTukenmeHizi(urununAylikTukenmeMiktari.divide(BigDecimal.valueOf(4), 2, RoundingMode.HALF_UP));

            BigDecimal urunFire = stokGirisiRepository.getUrunFire(ilkStokGirisTarihiZoned, stokBittiTarihiZoned, urunId);
            urunTukenmeDTO.setUrunFire(urunFire);

            return urunTukenmeDTO;
        } catch (Exception e) {
            throw new InsufficientDataException("Yeterli veri bulunamadi", e);
        }

    }
}
