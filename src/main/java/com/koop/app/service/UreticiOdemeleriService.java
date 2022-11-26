package com.koop.app.service;

import com.koop.app.domain.UreticiOdemeleri;
import com.koop.app.domain.Urun;
import com.koop.app.dto.FiyatHesapDTO;
import com.koop.app.repository.UreticiOdemeleriRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Optional;

/**
 * Service Implementation for managing {@link UreticiOdemeleri}.
 */
@Service
@Transactional
public class UreticiOdemeleriService {

    private final Logger log = LoggerFactory.getLogger(UreticiOdemeleriService.class);

    private final UreticiOdemeleriRepository ureticiOdemeleriRepository;

    public UreticiOdemeleriService(UreticiOdemeleriRepository ureticiOdemeleriRepository) {
        this.ureticiOdemeleriRepository = ureticiOdemeleriRepository;
    }

    /**
     * Save a ureticiOdemeleri.
     *
     * @param ureticiOdemeleri the entity to save.
     * @return the persisted entity.
     */
    public UreticiOdemeleri save(UreticiOdemeleri ureticiOdemeleri) {
        log.debug("Request to save UreticiOdemeleri : {}", ureticiOdemeleri);
        return ureticiOdemeleriRepository.save(ureticiOdemeleri);
    }

    /**
     * Get all the ureticiOdemeleris.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<UreticiOdemeleri> findAll(Pageable pageable) {
        log.debug("Request to get all UreticiOdemeleris");
        return ureticiOdemeleriRepository.findAll(pageable);
    }


    /**
     * Get one ureticiOdemeleri by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<UreticiOdemeleri> findOne(Long id) {
        log.debug("Request to get UreticiOdemeleri : {}", id);
        return ureticiOdemeleriRepository.findById(id);
    }

    /**
     * Delete the ureticiOdemeleri by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete UreticiOdemeleri : {}", id);
        ureticiOdemeleriRepository.deleteById(id);
    }

    public void createUreticiOdemesi(FiyatHesapDTO fiyatHesapDTO, Urun urun) {
        Optional<UreticiOdemeleri> oneUreticiOdemeleriByUrun = ureticiOdemeleriRepository.findOneUreticiOdemeleriByUrun(urun.getUretici().getId());
        UreticiOdemeleri ureticiOdemeleri;
        double kdvOraniCarpimi = (100 + urun.getKdvKategorisi().getKdvOrani()) * 0.01;
        if (oneUreticiOdemeleriByUrun.isPresent()) {
            ureticiOdemeleri = oneUreticiOdemeleriByUrun.get();
            BigDecimal kdvliTutar = fiyatHesapDTO.getTutar().multiply(BigDecimal.valueOf(kdvOraniCarpimi));
            ureticiOdemeleri.setTutar(ureticiOdemeleri.getTutar().add(kdvliTutar));
        } else {
            ureticiOdemeleri = new UreticiOdemeleri();
            ureticiOdemeleri.setTutar(fiyatHesapDTO.getTutar().multiply(BigDecimal.valueOf(kdvOraniCarpimi)));
        }
        ureticiOdemeleri.setUretici(urun.getUretici());
        ureticiOdemeleri.setSonGuncellenmeTarihi(ZonedDateTime.now());
        ureticiOdemeleriRepository.save(ureticiOdemeleri);
    }

    public BigDecimal findTotalBorc() {
        return ureticiOdemeleriRepository.findTotalBorc() == null ? BigDecimal.ZERO : ureticiOdemeleriRepository.findTotalBorc();
    }
}
