package com.koop.app.service;

import com.koop.app.domain.Urun;
import com.koop.app.repository.UrunRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.jobrunr.jobs.annotations.Job;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Calendar;
import java.util.List;

/**
 * Service class for financial processes.
 */
@Service
@Transactional
public class MaliService {

    private final UrunRepository urunRepository;
    private final MailService mailService;

    public MaliService(UrunRepository urunRepository, MailService mailService) {
        this.urunRepository = urunRepository;
        this.mailService = mailService;
    }

    /**
     * Her ayin sonu stok raporunu mali birimin mail adresine atar. Simdilik sadece kadikoy koop icin.
     */
    @Job(name = "Aylik Mali Stok Raporu")
    public void sendStockMail() throws IOException {
        final Calendar c = Calendar.getInstance();
        if (c.get(Calendar.DATE) == c.getActualMaximum(Calendar.DATE)) {
            try (Workbook workbook = new XSSFWorkbook()) {
                Sheet sheet = workbook.createSheet("Persons");
                sheet.setColumnWidth(0, 6000);
                sheet.setColumnWidth(1, 4000);

                Row header = sheet.createRow(0);

                Cell headerCell = header.createCell(0);
                headerCell.setCellValue("Ürün Adı");
                headerCell = header.createCell(1);
                headerCell.setCellValue("Stok");
                headerCell = header.createCell(2);
                headerCell.setCellValue("Fiyat");
                headerCell = header.createCell(3);
                headerCell.setCellValue("Birim");

                CellStyle style = workbook.createCellStyle();
                style.setWrapText(true);

                List<Urun> satistakiUrunler = urunRepository.findSatistakiUrunlerKadikoy();
                for (int i = 0, satistakiUrunlerSize = satistakiUrunler.size(); i < satistakiUrunlerSize; i++) {
                    Urun urun = satistakiUrunler.get(i);
                    Row row = sheet.createRow(i + 1);
                    Cell cell = row.createCell(0);
                    cell.setCellValue(urun.getUrunAdi());
                    cell.setCellStyle(style);

                    cell = row.createCell(1);
                    cell.setCellValue(urun.getStok().doubleValue());
                    cell.setCellStyle(style);

                    cell = row.createCell(2);
                    cell.setCellValue(urun.getMusteriFiyati().doubleValue());
                    cell.setCellStyle(style);

                    cell = row.createCell(3);
                    cell.setCellValue(urun.getBirim().name());
                    cell.setCellStyle(style);
                }

                File currDir = new File(".");
                String path = currDir.getAbsolutePath();
                String fileLocation = path.substring(0, path.length() - 1) + "stokRaporu.xlsx";

                FileOutputStream outputStream = new FileOutputStream(fileLocation, false);
                workbook.write(outputStream);

                mailService.sendEmailWithFile(
                    "mali@kadikoykoop.org",
                    "Ay Sonu Stok Raporu",
                    "Bu ay sonunun stok raporunu ekte bulabilirsiniz.",
                    fileLocation
                );
            }
        }
    }
}
