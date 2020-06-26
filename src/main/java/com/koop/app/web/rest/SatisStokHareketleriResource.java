package com.koop.app.web.rest;

import com.koop.app.domain.SatisStokHareketleri;
import com.koop.app.dto.AylikSatislar;
import com.koop.app.dto.AylikSatislarRaporu;
import com.koop.app.repository.SatisStokHareketleriRepository;
import com.koop.app.repository.UrunRepository;
import com.koop.app.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.chrono.ChronoZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

/**
 * REST controller for managing {@link com.koop.app.domain.SatisStokHareketleri}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SatisStokHareketleriResource {
    private static final String ENTITY_NAME = "satisStokHareketleri";
    private final Logger log = LoggerFactory.getLogger(SatisStokHareketleriResource.class);
    private final SatisStokHareketleriRepository satisStokHareketleriRepository;

    private final UrunRepository urunRepository;

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    public SatisStokHareketleriResource(
        SatisStokHareketleriRepository satisStokHareketleriRepository,
        UrunRepository urunRepository
    ) {
        this.satisStokHareketleriRepository = satisStokHareketleriRepository;
        this.urunRepository = urunRepository;
    }

    /**
     * {@code POST  /satis-stok-hareketleris} : Create a new satisStokHareketleri.
     *
     * @param satisStokHareketleri the satisStokHareketleri to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new satisStokHareketleri, or with status {@code 400 (Bad Request)} if the satisStokHareketleri has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/satis-stok-hareketleris")
    public ResponseEntity<SatisStokHareketleri> createSatisStokHareketleri(
        @Valid @RequestBody SatisStokHareketleri satisStokHareketleri
    )
        throws URISyntaxException {
        log.debug("REST request to save SatisStokHareketleri : {}", satisStokHareketleri);
        if (satisStokHareketleri.getId() != null) {
            throw new BadRequestAlertException(
                "A new satisStokHareketleri cannot already have an ID",
                ENTITY_NAME,
                "idexists"
            );
        }
        SatisStokHareketleri result = satisStokHareketleriRepository.save(satisStokHareketleri);
        urunRepository.save(result.getUrun());
        return ResponseEntity
            .created(new URI("/api/satis-stok-hareketleris/" + result.getId()))
            .headers(
                HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString())
            )
            .body(result);
    }

    /**
     * {@code PUT  /satis-stok-hareketleris} : Updates an existing satisStokHareketleri.
     *
     * @param satisStokHareketleri the satisStokHareketleri to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated satisStokHareketleri,
     * or with status {@code 400 (Bad Request)} if the satisStokHareketleri is not valid,
     * or with status {@code 500 (Internal Server Error)} if the satisStokHareketleri couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/satis-stok-hareketleris")
    public ResponseEntity<SatisStokHareketleri> updateSatisStokHareketleri(
        @Valid @RequestBody SatisStokHareketleri satisStokHareketleri
    )
        throws URISyntaxException {
        log.debug("REST request to update SatisStokHareketleri : {}", satisStokHareketleri);
        if (satisStokHareketleri.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        SatisStokHareketleri result = satisStokHareketleriRepository.save(satisStokHareketleri);
        return ResponseEntity
            .ok()
            .headers(
                HeaderUtil.createEntityUpdateAlert(
                    applicationName,
                    true,
                    ENTITY_NAME,
                    satisStokHareketleri.getId().toString()
                )
            )
            .body(result);
    }

    /**
     * {@code GET  /satis-stok-hareketleris} : get all the satisStokHareketleris.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of satisStokHareketleris in body.
     */
    @GetMapping("/satis-stok-hareketleris")
    public ResponseEntity<List<SatisStokHareketleri>> getAllSatisStokHareketleris(Pageable pageable) {
        log.debug("REST request to get a page of SatisStokHareketleris");
        Page<SatisStokHareketleri> page = satisStokHareketleriRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(
            ServletUriComponentsBuilder.fromCurrentRequest(),
            page
        );
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /satis-stok-hareketleris/:id} : get the "id" satisStokHareketleri.
     *
     * @param id the id of the satisStokHareketleri to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the satisStokHareketleri, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/satis-stok-hareketleris/{id}")
    public ResponseEntity<SatisStokHareketleri> getSatisStokHareketleri(@PathVariable Long id) {
        log.debug("REST request to get SatisStokHareketleri : {}", id);
        Optional<SatisStokHareketleri> satisStokHareketleri = satisStokHareketleriRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(satisStokHareketleri);
    }

    /**
     * {@code DELETE  /satis-stok-hareketleris/:id} : delete the "id" satisStokHareketleri.
     *
     * @param id the id of the satisStokHareketleri to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/satis-stok-hareketleris/{id}")
    public ResponseEntity<Void> deleteSatisStokHareketleri(@PathVariable Long id) {
        log.debug("REST request to delete SatisStokHareketleri : {}", id);
        satisStokHareketleriRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/satis-stok-hareketleris/getSatisRaporlari")
    public AylikSatislarRaporu getSatisRaporlari() {
        List<AylikSatislar> satisRaporlari = satisStokHareketleriRepository.getSatisRaporlari();
        AylikSatislarRaporu aylikSatislarRaporu = new AylikSatislarRaporu();

        aylikSatislarRaporu.setAylikSatisMap(
            satisRaporlari
                .stream()
                .collect(
                    Collectors.toMap(
                        aylikSatislar -> {
                            if (String.valueOf(aylikSatislar.getMonth()).length() == 1) {
                                return (
                                    aylikSatislar.getYear() +
                                    ".0" +
                                    aylikSatislar.getMonth() +
                                    aylikSatislar.getUrunAdi()
                                );
                            }
                            return (
                                aylikSatislar.getYear() + "." + aylikSatislar.getMonth() + aylikSatislar.getUrunAdi()
                            );
                        },
                        AylikSatislar::getMiktar,
                        (aylikSatislar1, aylikSatislar2) -> aylikSatislar1
                    )
                )
        );

        List<ZonedDateTime> tarihListesi = new ArrayList<>();
        for (AylikSatislar satisRaporu : satisRaporlari) {
            int month = satisRaporu.getMonth();
            int year = satisRaporu.getYear();
            ZonedDateTime yearMonth = ZonedDateTime.of(year, month, 1, 0, 0, 0, 0, ZoneId.systemDefault());
            tarihListesi.add(yearMonth);
        }
        tarihListesi = tarihListesi.stream().distinct().collect(Collectors.toList());
        tarihListesi.sort(ChronoZonedDateTime::compareTo);
        aylikSatislarRaporu.setTarihListesi(tarihListesi);

        aylikSatislarRaporu.setUrunAdiListesi(
            satisRaporlari.stream().map(AylikSatislar::getUrunAdi).distinct().collect(Collectors.toList())
        );
        return aylikSatislarRaporu;
    }
}
