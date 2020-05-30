package com.koop.app.web.rest;

import com.koop.app.domain.Kisiler;
import com.koop.app.repository.KisilerRepository;
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
 * REST controller for managing {@link com.koop.app.domain.Kisiler}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class KisilerResource {

    private final Logger log = LoggerFactory.getLogger(KisilerResource.class);

    private static final String ENTITY_NAME = "kisiler";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final KisilerRepository kisilerRepository;

    public KisilerResource(KisilerRepository kisilerRepository) {
        this.kisilerRepository = kisilerRepository;
    }

    /**
     * {@code POST  /kisilers} : Create a new kisiler.
     *
     * @param kisiler the kisiler to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new kisiler, or with status {@code 400 (Bad Request)} if the kisiler has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/kisilers")
    public ResponseEntity<Kisiler> createKisiler(@RequestBody Kisiler kisiler) throws URISyntaxException {
        log.debug("REST request to save Kisiler : {}", kisiler);
        if (kisiler.getId() != null) {
            throw new BadRequestAlertException("A new kisiler cannot already have an ID", ENTITY_NAME, "idexists");
        }
        kisiler.setActive(true);
        Kisiler result = kisilerRepository.save(kisiler);
        return ResponseEntity.created(new URI("/api/kisilers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /kisilers} : Updates an existing kisiler.
     *
     * @param kisiler the kisiler to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated kisiler,
     * or with status {@code 400 (Bad Request)} if the kisiler is not valid,
     * or with status {@code 500 (Internal Server Error)} if the kisiler couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/kisilers")
    public ResponseEntity<Kisiler> updateKisiler(@RequestBody Kisiler kisiler) throws URISyntaxException {
        log.debug("REST request to update Kisiler : {}", kisiler);
        if (kisiler.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Kisiler result = kisilerRepository.save(kisiler);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, kisiler.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /kisilers} : get all the kisilers.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of kisilers in body.
     */
    @GetMapping("/kisilers")
    public ResponseEntity<List<Kisiler>> getAllKisilers(Pageable pageable) {
        log.debug("REST request to get a page of Kisilers");
        Page<Kisiler> page = kisilerRepository.findAllActive(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /kisilers/:id} : get the "id" kisiler.
     *
     * @param id the id of the kisiler to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the kisiler, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/kisilers/{id}")
    public ResponseEntity<Kisiler> getKisiler(@PathVariable Long id) {
        log.debug("REST request to get Kisiler : {}", id);
        Optional<Kisiler> kisiler = kisilerRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(kisiler);
    }

    /**
     * {@code DELETE  /kisilers/:id} : delete the "id" kisiler.
     *
     * @param id the id of the kisiler to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/kisilers/{id}")
    public ResponseEntity<Void> deleteKisiler(@PathVariable Long id) {
        log.debug("REST request to delete Kisiler : {}", id);
        Optional<Kisiler> kisiler = kisilerRepository.findById(id);
        kisiler.ifPresent(kisiler1 -> {
            kisiler1.setActive(false);
            kisilerRepository.save(kisiler1);
        });
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
