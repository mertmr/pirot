package com.koop.app.web.rest;

import com.koop.app.domain.BorcAlacak;
import com.koop.app.repository.BorcAlacakRepository;
import com.koop.app.web.rest.errors.BadRequestAlertException;
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
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.koop.app.domain.BorcAlacak}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class BorcAlacakResource {

    private final Logger log = LoggerFactory.getLogger(BorcAlacakResource.class);

    private static final String ENTITY_NAME = "borcAlacak";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BorcAlacakRepository borcAlacakRepository;

    public BorcAlacakResource(BorcAlacakRepository borcAlacakRepository) {
        this.borcAlacakRepository = borcAlacakRepository;
    }

    /**
     * {@code POST  /borc-alacaks} : Create a new borcAlacak.
     *
     * @param borcAlacak the borcAlacak to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new borcAlacak, or with status {@code 400 (Bad Request)} if the borcAlacak has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/borc-alacaks")
    public ResponseEntity<BorcAlacak> createBorcAlacak(@RequestBody BorcAlacak borcAlacak) throws URISyntaxException {
        log.debug("REST request to save BorcAlacak : {}", borcAlacak);
        if (borcAlacak.getId() != null) {
            throw new BadRequestAlertException("A new borcAlacak cannot already have an ID", ENTITY_NAME, "idexists");
        }
        BorcAlacak result = borcAlacakRepository.save(borcAlacak);
        return ResponseEntity
            .created(new URI("/api/borc-alacaks/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /borc-alacaks} : Updates an existing borcAlacak.
     *
     * @param borcAlacak the borcAlacak to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated borcAlacak,
     * or with status {@code 400 (Bad Request)} if the borcAlacak is not valid,
     * or with status {@code 500 (Internal Server Error)} if the borcAlacak couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/borc-alacaks")
    public ResponseEntity<BorcAlacak> updateBorcAlacak(@RequestBody BorcAlacak borcAlacak) throws URISyntaxException {
        log.debug("REST request to update BorcAlacak : {}", borcAlacak);
        if (borcAlacak.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        BorcAlacak result = borcAlacakRepository.save(borcAlacak);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, borcAlacak.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /borc-alacaks} : get all the borcAlacaks.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of borcAlacaks in body.
     */
    @GetMapping("/borc-alacaks")
    public ResponseEntity<List<BorcAlacak>> getAllBorcAlacaks(Pageable pageable) {
        log.debug("REST request to get a page of BorcAlacaks");
        Page<BorcAlacak> page = borcAlacakRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /borc-alacaks/:id} : get the "id" borcAlacak.
     *
     * @param id the id of the borcAlacak to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the borcAlacak, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/borc-alacaks/{id}")
    public ResponseEntity<BorcAlacak> getBorcAlacak(@PathVariable Long id) {
        log.debug("REST request to get BorcAlacak : {}", id);
        Optional<BorcAlacak> borcAlacak = borcAlacakRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(borcAlacak);
    }

    /**
     * {@code DELETE  /borc-alacaks/:id} : delete the "id" borcAlacak.
     *
     * @param id the id of the borcAlacak to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/borc-alacaks/{id}")
    public ResponseEntity<Void> deleteBorcAlacak(@PathVariable Long id) {
        log.debug("REST request to delete BorcAlacak : {}", id);
        borcAlacakRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
