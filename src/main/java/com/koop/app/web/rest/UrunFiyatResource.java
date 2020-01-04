package com.koop.app.web.rest;

import com.koop.app.domain.UrunFiyat;
import com.koop.app.domain.User;
import com.koop.app.repository.UrunFiyatRepository;
import com.koop.app.service.UserService;
import com.koop.app.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.koop.app.domain.UrunFiyat}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UrunFiyatResource {

    private final Logger log = LoggerFactory.getLogger(UrunFiyatResource.class);

    private static final String ENTITY_NAME = "urunFiyat";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UrunFiyatRepository urunFiyatRepository;

    private final UserService userService;

    public UrunFiyatResource(UrunFiyatRepository urunFiyatRepository, UserService userService) {
        this.urunFiyatRepository = urunFiyatRepository;
        this.userService = userService;
    }

    /**
     * {@code POST  /urun-fiyats} : Create a new urunFiyat.
     *
     * @param urunFiyat the urunFiyat to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new urunFiyat, or with status {@code 400 (Bad Request)} if the urunFiyat has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/urun-fiyats")
    public ResponseEntity<UrunFiyat> createUrunFiyat(@RequestBody UrunFiyat urunFiyat) throws URISyntaxException {
        log.debug("REST request to save UrunFiyat : {}", urunFiyat);
        if (urunFiyat.getId() != null) {
            throw new BadRequestAlertException("A new urunFiyat cannot already have an ID", ENTITY_NAME, "idexists");
        }
        User currentUser = userService.getCurrentUser();
        urunFiyat.setUser(currentUser);
        urunFiyat.setTarih(ZonedDateTime.now());
        UrunFiyat result = urunFiyatRepository.save(urunFiyat);
        return ResponseEntity.created(new URI("/api/urun-fiyats/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /urun-fiyats} : Updates an existing urunFiyat.
     *
     * @param urunFiyat the urunFiyat to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated urunFiyat,
     * or with status {@code 400 (Bad Request)} if the urunFiyat is not valid,
     * or with status {@code 500 (Internal Server Error)} if the urunFiyat couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/urun-fiyats")
    public ResponseEntity<UrunFiyat> updateUrunFiyat(@RequestBody UrunFiyat urunFiyat) throws URISyntaxException {
        log.debug("REST request to update UrunFiyat : {}", urunFiyat);
        if (urunFiyat.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        User currentUser = userService.getCurrentUser();
        urunFiyat.setUser(currentUser);
        urunFiyat.setTarih(ZonedDateTime.now());
        UrunFiyat result = urunFiyatRepository.save(urunFiyat);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, urunFiyat.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /urun-fiyats} : get all the urunFiyats.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of urunFiyats in body.
     */
    @GetMapping("/urun-fiyats")
    public ResponseEntity<List<UrunFiyat>> getAllUrunFiyats(Pageable pageable) {
        log.debug("REST request to get a page of UrunFiyats");
        Page<UrunFiyat> page = urunFiyatRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /urun-fiyats/:id} : get the "id" urunFiyat.
     *
     * @param id the id of the urunFiyat to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the urunFiyat, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/urun-fiyats/{id}")
    public ResponseEntity<UrunFiyat> getUrunFiyat(@PathVariable Long id) {
        log.debug("REST request to get UrunFiyat : {}", id);
        Optional<UrunFiyat> urunFiyat = urunFiyatRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(urunFiyat);
    }

    /**
     * {@code DELETE  /urun-fiyats/:id} : delete the "id" urunFiyat.
     *
     * @param id the id of the urunFiyat to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/urun-fiyats/{id}")
    public ResponseEntity<Void> deleteUrunFiyat(@PathVariable Long id) {
        log.debug("REST request to delete UrunFiyat : {}", id);
        urunFiyatRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
