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
        long qty = kisilerRepository.count();
        int idx = (int)(Math.random() * qty);
        Page<Kisiler> kisiPage = kisilerRepository.findAll(PageRequest.of(idx, 1));
        Kisiler kisi = null;
        if (kisiPage.hasContent()) {
            kisi = kisiPage.getContent().get(0);
        }
        return kisi;
    }
}
