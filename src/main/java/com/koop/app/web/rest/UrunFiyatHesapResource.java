package com.koop.app.web.rest;

import com.koop.app.domain.UrunFiyatHesap;
import com.koop.app.repository.UrunFiyatHesapRepository;
import com.koop.app.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

/**
 * REST controller for managing {@link com.koop.app.domain.UrunFiyatHesap}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UrunFiyatHesapResource {
    private final Logger log = LoggerFactory.getLogger(UrunFiyatHesapResource.class);

    private static final String ENTITY_NAME = "urunFiyatHesap";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UrunFiyatHesapRepository urunFiyatHesapRepository;

    public UrunFiyatHesapResource(UrunFiyatHesapRepository urunFiyatHesapRepository) {
        this.urunFiyatHesapRepository = urunFiyatHesapRepository;
    }

    /**
     * {@code POST  /urun-fiyat-hesaps} : Create a new urunFiyatHesap.
     *
     * @param urunFiyatHesap the urunFiyatHesap to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new urunFiyatHesap, or with status {@code 400 (Bad Request)} if the urunFiyatHesap has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/urun-fiyat-hesaps")
    public ResponseEntity<UrunFiyatHesap> createUrunFiyatHesap(@RequestBody UrunFiyatHesap urunFiyatHesap)
        throws URISyntaxException {
        log.debug("REST request to save UrunFiyatHesap : {}", urunFiyatHesap);
        if (urunFiyatHesap.getId() != null) {
            throw new BadRequestAlertException(
                "A new urunFiyatHesap cannot already have an ID",
                ENTITY_NAME,
                "idexists"
            );
        }
        UrunFiyatHesap result = urunFiyatHesapRepository.save(urunFiyatHesap);
        return ResponseEntity
            .created(new URI("/api/urun-fiyat-hesaps/" + result.getId()))
            .headers(
                HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString())
            )
            .body(result);
    }

    /**
     * {@code PUT  /urun-fiyat-hesaps} : Updates an existing urunFiyatHesap.
     *
     * @param urunFiyatHesap the urunFiyatHesap to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated urunFiyatHesap,
     * or with status {@code 400 (Bad Request)} if the urunFiyatHesap is not valid,
     * or with status {@code 500 (Internal Server Error)} if the urunFiyatHesap couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/urun-fiyat-hesaps")
    public ResponseEntity<UrunFiyatHesap> updateUrunFiyatHesap(@RequestBody UrunFiyatHesap urunFiyatHesap)
        throws URISyntaxException {
        log.debug("REST request to update UrunFiyatHesap : {}", urunFiyatHesap);
        if (urunFiyatHesap.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        UrunFiyatHesap result = urunFiyatHesapRepository.save(urunFiyatHesap);
        return ResponseEntity
            .ok()
            .headers(
                HeaderUtil.createEntityUpdateAlert(
                    applicationName,
                    true,
                    ENTITY_NAME,
                    urunFiyatHesap.getId().toString()
                )
            )
            .body(result);
    }

    /**
     * {@code GET  /urun-fiyat-hesaps} : get all the urunFiyatHesaps.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of urunFiyatHesaps in body.
     */
    @GetMapping("/urun-fiyat-hesaps")
    public ResponseEntity<List<UrunFiyatHesap>> getAllUrunFiyatHesaps(Pageable pageable) {
        log.debug("REST request to get a page of UrunFiyatHesaps");
        Page<UrunFiyatHesap> page = urunFiyatHesapRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(
            ServletUriComponentsBuilder.fromCurrentRequest(),
            page
        );
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /urun-fiyat-hesaps/:id} : get the "id" urunFiyatHesap.
     *
     * @param id the id of the urunFiyatHesap to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the urunFiyatHesap, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/urun-fiyat-hesaps/{id}")
    public ResponseEntity<UrunFiyatHesap> getUrunFiyatHesap(@PathVariable Long id) {
        log.debug("REST request to get UrunFiyatHesap : {}", id);
        Optional<UrunFiyatHesap> urunFiyatHesap = urunFiyatHesapRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(urunFiyatHesap);
    }

    /**
     * {@code GET  /urun-fiyat-hesaps/:urunId} : get the "urunId" urunFiyatHesap.
     *
     * @param urunId the urunId of the urunFiyatHesap to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the urunFiyatHesap, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/urun-fiyat-hesaps/urun-fiyat-by-urun-id/{urunId}")
    public ResponseEntity<UrunFiyatHesap> getUrunFiyatHesapByUrunId(@PathVariable Long urunId) {
        log.debug("REST request to get UrunFiyatHesap : {}", urunId);
        Optional<UrunFiyatHesap> urunFiyatHesap = urunFiyatHesapRepository.findByUrunId(urunId);
        return ResponseUtil.wrapOrNotFound(urunFiyatHesap);
    }

    /**
     * {@code DELETE  /urun-fiyat-hesaps/:id} : delete the "id" urunFiyatHesap.
     *
     * @param id the id of the urunFiyatHesap to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/urun-fiyat-hesaps/{id}")
    public ResponseEntity<Void> deleteUrunFiyatHesap(@PathVariable Long id) {
        log.debug("REST request to delete UrunFiyatHesap : {}", id);
        urunFiyatHesapRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
