package com.koop.app.service;

import com.koop.app.domain.Urun;
import com.koop.app.repository.StokGirisiRepository;
import com.koop.app.repository.UrunRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
        return urunRepository.findSatistakiUrunler();
    }

    public Page<Urun> search(String query, Pageable pageable) {
        return urunRepository.findByUrunAdiContainingIgnoreCase(query, pageable);
    }
}
