package com.koop.app.service;

import com.koop.app.domain.Kisiler;
import com.koop.app.repository.KisilerRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class KisilerService {
    private final KisilerRepository kisilerRepository;

    public KisilerService(KisilerRepository kisilerRepository) {
        this.kisilerRepository = kisilerRepository;
    }

    public Kisiler getRandomKisi() {
        long qty = kisilerRepository.countActive();
        int idx = (int) (Math.random() * qty);
        if(idx == 0) {
            idx++;
        }
        if(idx > 25) {
            idx = 25;
        }
        Page<Kisiler> kisiPage = kisilerRepository.findAllActive(PageRequest.of(idx, 1));
        Kisiler kisi = null;
        if (kisiPage.hasContent()) {
            kisi = kisiPage.getContent().get(0);
        }
        return kisi;
    }
}
