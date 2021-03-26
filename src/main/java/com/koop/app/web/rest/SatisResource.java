package com.koop.app.web.rest;

import com.koop.app.domain.Satis;
import com.koop.app.repository.SatisRepository;
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
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.koop.app.domain.Satis}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SatisResource {

    private final Logger log = LoggerFactory.getLogger(SatisResource.class);

    private static final String ENTITY_NAME = "satis";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SatisRepository satisRepository;

    public SatisResource(SatisRepository satisRepository) {
        this.satisRepository = satisRepository;
    }

    /**
     * {@code POST  /satis} : Create a new satis.
     *
     * @param satis the satis to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new satis, or with status {@code 400 (Bad Request)} if the satis has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/satis")
    public ResponseEntity<Satis> createSatis(@RequestBody Satis satis) throws URISyntaxException {
        log.debug("REST request to save Satis : {}", satis);
        if (satis.getId() != null) {
            throw new BadRequestAlertException("A new satis cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Satis result = satisRepository.save(satis);
        return ResponseEntity.created(new URI("/api/satis/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /satis} : Updates an existing satis.
     *
     * @param satis the satis to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated satis,
     * or with status {@code 400 (Bad Request)} if the satis is not valid,
     * or with status {@code 500 (Internal Server Error)} if the satis couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/satis")
    public ResponseEntity<Satis> updateSatis(@RequestBody Satis satis) throws URISyntaxException {
        log.debug("REST request to update Satis : {}", satis);
        if (satis.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Satis result = satisRepository.save(satis);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, satis.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /satis} : get all the satis.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of satis in body.
     */
    @GetMapping("/satis")
    public ResponseEntity<List<Satis>> getAllSatis(Pageable pageable) {
        log.debug("REST request to get a page of Satis");
        Page<Satis> page = satisRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /satis/:id} : get the "id" satis.
     *
     * @param id the id of the satis to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the satis, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/satis/{id}")
    public ResponseEntity<Satis> getSatis(@PathVariable Long id) {
        log.debug("REST request to get Satis : {}", id);
        Optional<Satis> satis = satisRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(satis);
    }

    /**
     * {@code DELETE  /satis/:id} : delete the "id" satis.
     *
     * @param id the id of the satis to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/satis/{id}")
    public ResponseEntity<Void> deleteSatis(@PathVariable Long id) {
        log.debug("REST request to delete Satis : {}", id);
        satisRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
