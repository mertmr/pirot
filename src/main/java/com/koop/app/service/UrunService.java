package com.koop.app.service;

import com.koop.app.domain.Urun;
import com.koop.app.repository.StokGirisiRepository;
import com.koop.app.repository.UrunRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UrunService {
    private final UrunRepository urunRepository;

    private final StokGirisiRepository stokGirisiRepository;

    public UrunService(UrunRepository urunRepository, StokGirisiRepository stokGirisiRepository) {
        this.urunRepository = urunRepository;
        this.stokGirisiRepository = stokGirisiRepository;
    }

    public List<Urun> getAllUrunForSatis() {
//        List<Long> urunIds = stokGirisiRepository.findStokWithMoreThanZero();
//        return urunRepository.findAllById(urunIds);
        return urunRepository.findAll();
    }
}
