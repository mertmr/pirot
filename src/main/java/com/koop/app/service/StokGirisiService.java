package com.koop.app.service;

import com.koop.app.domain.StokGirisi;
import com.koop.app.domain.Urun;
import com.koop.app.domain.enumeration.Birim;
import com.koop.app.domain.enumeration.StokHareketiTipi;
import com.koop.app.dto.UrunStokGirisiDTO;
import com.koop.app.repository.StokGirisiRepository;
import com.koop.app.repository.UrunRepository;
import com.koop.app.service.dto.StokGirisiDto;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class StokGirisiService {

    private final StokGirisiRepository stokGirisiRepository;

    private final UrunRepository urunRepository;

    private final KasaHareketleriService kasaHareketleriService;

    public StokGirisiService(
        StokGirisiRepository stokGirisiRepository,
        UrunRepository urunRepository,
        KasaHareketleriService kasaHareketleriService
    ) {
        this.stokGirisiRepository = stokGirisiRepository;
        this.urunRepository = urunRepository;
        this.kasaHareketleriService = kasaHareketleriService;
    }

    public StokGirisi save(StokGirisi stokGirisi) {
        Urun urun = stokGirisi.getUrun();
        if (urun.getStok() == null || urun.getStok().compareTo(BigDecimal.ZERO) < 0) {
            urun.setStok(BigDecimal.ZERO);
        }

        if (stokGirisi.getStokHareketiTipi() == StokHareketiTipi.STOK_GIRISI) {
            urun.setStok(urun.getStok().add(BigDecimal.valueOf(stokGirisi.getMiktar())));
        } else if (stokGirisi.getStokHareketiTipi() == StokHareketiTipi.FIRE) {
            urun.setStok(urun.getStok().subtract(BigDecimal.valueOf(stokGirisi.getMiktar())));
        } else if (stokGirisi.getStokHareketiTipi() == StokHareketiTipi.STOK_DUZELTME) {
            urun.setStok(urun.getStok().add(BigDecimal.valueOf(stokGirisi.getMiktar())));
        } else if (stokGirisi.getStokHareketiTipi() == StokHareketiTipi.MASRAF) {
            urun.setStok(urun.getStok().subtract(BigDecimal.valueOf(stokGirisi.getMiktar())));
        } else if (stokGirisi.getStokHareketiTipi() == StokHareketiTipi.IADE) {
            urun.setStok(urun.getStok().add(BigDecimal.valueOf(stokGirisi.getMiktar())));
            BigDecimal musteriFiyati = urun.getMusteriFiyati();
            if (urun.getBirim() == Birim.GRAM) {
                musteriFiyati = urun.getMusteriFiyati().multiply(BigDecimal.valueOf(0.001));
            }
            kasaHareketleriService.createKasaHareketi(
                musteriFiyati.multiply(BigDecimal.valueOf(stokGirisi.getMiktar()).negate()),
                "Musteri iadesi: Kasadan para cikti"
            );
        }

        urunRepository.save(urun);
        return stokGirisiRepository.save(stokGirisi);
    }

    public StokGirisi update(StokGirisi stokGirisi) {
        return stokGirisiRepository.save(stokGirisi);
    }

    public Page<StokGirisiDto> search(String query, Pageable pageable) {
        return stokGirisiRepository.findByUrunAdi(query, pageable);
    }

    public List<UrunStokGirisiDTO> findOnlyStokGirisiByUrun(Long id) {
        List<StokGirisi> onlyStokGirisiByUrun = stokGirisiRepository.findOnlyStokGirisiByUrun(id);
        List<UrunStokGirisiDTO> urunStokGirisiDTOS = new ArrayList<>();
        for (StokGirisi stokGirisi : onlyStokGirisiByUrun) {
            UrunStokGirisiDTO urunStokGirisiDTO = new UrunStokGirisiDTO();
            urunStokGirisiDTO.setStokGirisiId(stokGirisi.getId());
            urunStokGirisiDTO.setMiktar(BigDecimal.valueOf(stokGirisi.getMiktar()));
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy - HH:mm");
            urunStokGirisiDTO.setStokGirisAciklamasi(
                "Miktar: " + stokGirisi.getMiktar() + " - Tarihi: " + stokGirisi.getTarih().format(formatter)
            );
            urunStokGirisiDTO.setStokGirisiTarihi(stokGirisi.getTarih());
            urunStokGirisiDTOS.add(urunStokGirisiDTO);
        }
        //        urunStokGirisiDTOS.remove(0); //son stok girisi genelde tukenmemis oluyor, dolayisiyla rapor uretmek imkansiza yakin
        return urunStokGirisiDTOS;
    }
}
