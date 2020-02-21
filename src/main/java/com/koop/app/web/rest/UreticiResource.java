package com.koop.app.web.rest;

import com.koop.app.domain.Uretici;
import com.koop.app.repository.UreticiRepository;
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
 * REST controller for managing {@link com.koop.app.domain.Uretici}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UreticiResource {

    private final Logger log = LoggerFactory.getLogger(UreticiResource.class);

    private static final String ENTITY_NAME = "uretici";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UreticiRepository ureticiRepository;

    public UreticiResource(UreticiRepository ureticiRepository) {
        this.ureticiRepository = ureticiRepository;
    }

    /**
     * {@code POST  /ureticis} : Create a new uretici.
     *
     * @param uretici the uretici to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new uretici, or with status {@code 400 (Bad Request)} if the uretici has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/ureticis")
    public ResponseEntity<Uretici> createUretici(@Valid @RequestBody Uretici uretici) throws URISyntaxException {
        log.debug("REST request to save Uretici : {}", uretici);
        if (uretici.getId() != null) {
            throw new BadRequestAlertException("A new uretici cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Uretici result = ureticiRepository.save(uretici);
        return ResponseEntity.created(new URI("/api/ureticis/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /ureticis} : Updates an existing uretici.
     *
     * @param uretici the uretici to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated uretici,
     * or with status {@code 400 (Bad Request)} if the uretici is not valid,
     * or with status {@code 500 (Internal Server Error)} if the uretici couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/ureticis")
    public ResponseEntity<Uretici> updateUretici(@Valid @RequestBody Uretici uretici) throws URISyntaxException {
        log.debug("REST request to update Uretici : {}", uretici);
        if (uretici.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Uretici result = ureticiRepository.save(uretici);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, uretici.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /ureticis} : get all the ureticis.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of ureticis in body.
     */
    @GetMapping("/ureticis")
    public ResponseEntity<List<Uretici>> getAllUreticis(Pageable pageable) {
        log.debug("REST request to get a page of Ureticis");
        Page<Uretici> page = ureticiRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /ureticis/:id} : get the "id" uretici.
     *
     * @param id the id of the uretici to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the uretici, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/ureticis/{id}")
    public ResponseEntity<Uretici> getUretici(@PathVariable Long id) {
        log.debug("REST request to get Uretici : {}", id);
        Optional<Uretici> uretici = ureticiRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(uretici);
    }

    /**
     * {@code DELETE  /ureticis/:id} : delete the "id" uretici.
     *
     * @param id the id of the uretici to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/ureticis/{id}")
    public ResponseEntity<Void> deleteUretici(@PathVariable Long id) {
        log.debug("REST request to delete Uretici : {}", id);
        ureticiRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
