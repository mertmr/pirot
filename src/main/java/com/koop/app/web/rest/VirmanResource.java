package com.koop.app.web.rest;

import com.koop.app.domain.Virman;
import com.koop.app.repository.VirmanRepository;
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

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.koop.app.domain.Virman}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class VirmanResource {

    private final Logger log = LoggerFactory.getLogger(VirmanResource.class);

    private static final String ENTITY_NAME = "virman";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VirmanRepository virmanRepository;

    public VirmanResource(VirmanRepository virmanRepository) {
        this.virmanRepository = virmanRepository;
    }

    /**
     * {@code POST  /virmen} : Create a new virman.
     *
     * @param virman the virman to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new virman, or with status {@code 400 (Bad Request)} if the virman has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/virmen")
    public ResponseEntity<Virman> createVirman(@Valid @RequestBody Virman virman) throws URISyntaxException {
        log.debug("REST request to save Virman : {}", virman);
        if (virman.getId() != null) {
            throw new BadRequestAlertException("A new virman cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Virman result = virmanRepository.save(virman);
        return ResponseEntity.created(new URI("/api/virmen/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /virmen} : Updates an existing virman.
     *
     * @param virman the virman to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated virman,
     * or with status {@code 400 (Bad Request)} if the virman is not valid,
     * or with status {@code 500 (Internal Server Error)} if the virman couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/virmen")
    public ResponseEntity<Virman> updateVirman(@Valid @RequestBody Virman virman) throws URISyntaxException {
        log.debug("REST request to update Virman : {}", virman);
        if (virman.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Virman result = virmanRepository.save(virman);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, virman.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /virmen} : get all the virmen.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of virmen in body.
     */
    @GetMapping("/virmen")
    public ResponseEntity<List<Virman>> getAllVirmen(Pageable pageable) {
        log.debug("REST request to get a page of Virmen");
        Page<Virman> page = virmanRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /virmen/:id} : get the "id" virman.
     *
     * @param id the id of the virman to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the virman, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/virmen/{id}")
    public ResponseEntity<Virman> getVirman(@PathVariable Long id) {
        log.debug("REST request to get Virman : {}", id);
        Optional<Virman> virman = virmanRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(virman);
    }

    /**
     * {@code DELETE  /virmen/:id} : delete the "id" virman.
     *
     * @param id the id of the virman to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/virmen/{id}")
    public ResponseEntity<Void> deleteVirman(@PathVariable Long id) {
        log.debug("REST request to delete Virman : {}", id);
        virmanRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
