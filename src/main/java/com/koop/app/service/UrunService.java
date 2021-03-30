package com.koop.app.service;

import com.koop.app.domain.Urun;
import com.koop.app.repository.UrunRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class UrunService {

    private final UrunRepository urunRepository;

    public UrunService(UrunRepository urunRepository) {
        this.urunRepository = urunRepository;
    }

    public List<Urun> getAllUrunForSatis() {
        return urunRepository.findSatistakiUrunler();
    }

    public Page<Urun> search(String query, Pageable pageable) {
        return urunRepository.findByUrunAdiContainingIgnoreCaseAndActive(query, true, pageable);
    }

    public void deleteUrun(Long id) {
        Optional<Urun> urun = urunRepository.findById(id);
        urun.ifPresent(
            urunToDelete -> {
                urunToDelete.setActive(false);
                urunRepository.save(urunToDelete);
            }
        );
    }

    public List<Urun> getAllUrunForStokGirisi() {
        return urunRepository.getAllUrunForStokGirisi();
    }
}
