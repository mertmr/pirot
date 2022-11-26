package com.koop.app.web.rest;

import com.koop.app.domain.UreticiOdemeleri;
import com.koop.app.service.UreticiOdemeleriService;
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
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.koop.app.domain.UreticiOdemeleri}.
 */
@RestController
@RequestMapping("/api")
public class UreticiOdemeleriResource {

    private final Logger log = LoggerFactory.getLogger(UreticiOdemeleriResource.class);

    private static final String ENTITY_NAME = "ureticiOdemeleri";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UreticiOdemeleriService ureticiOdemeleriService;

    public UreticiOdemeleriResource(UreticiOdemeleriService ureticiOdemeleriService) {
        this.ureticiOdemeleriService = ureticiOdemeleriService;
    }

    /**
     * {@code POST  /uretici-odemeleris} : Create a new ureticiOdemeleri.
     *
     * @param ureticiOdemeleri the ureticiOdemeleri to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new ureticiOdemeleri, or with status {@code 400 (Bad Request)} if the ureticiOdemeleri has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/uretici-odemeleris")
    public ResponseEntity<UreticiOdemeleri> createUreticiOdemeleri(@RequestBody UreticiOdemeleri ureticiOdemeleri) throws URISyntaxException {
        log.debug("REST request to save UreticiOdemeleri : {}", ureticiOdemeleri);
        if (ureticiOdemeleri.getId() != null) {
            throw new BadRequestAlertException("A new ureticiOdemeleri cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UreticiOdemeleri result = ureticiOdemeleriService.save(ureticiOdemeleri);
        return ResponseEntity.created(new URI("/api/uretici-odemeleris/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /uretici-odemeleris} : Updates an existing ureticiOdemeleri.
     *
     * @param ureticiOdemeleri the ureticiOdemeleri to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ureticiOdemeleri,
     * or with status {@code 400 (Bad Request)} if the ureticiOdemeleri is not valid,
     * or with status {@code 500 (Internal Server Error)} if the ureticiOdemeleri couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/uretici-odemeleris")
    public ResponseEntity<UreticiOdemeleri> updateUreticiOdemeleri(@RequestBody UreticiOdemeleri ureticiOdemeleri) throws URISyntaxException {
        log.debug("REST request to update UreticiOdemeleri : {}", ureticiOdemeleri);
        if (ureticiOdemeleri.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        UreticiOdemeleri result = ureticiOdemeleriService.save(ureticiOdemeleri);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ureticiOdemeleri.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /uretici-odemeleris} : get all the ureticiOdemeleris.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of ureticiOdemeleris in body.
     */
    @GetMapping("/uretici-odemeleris")
    public ResponseEntity<List<UreticiOdemeleri>> getAllUreticiOdemeleris(Pageable pageable) {
        log.debug("REST request to get a page of UreticiOdemeleris");
        Page<UreticiOdemeleri> page = ureticiOdemeleriService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /uretici-odemeleris/:id} : get the "id" ureticiOdemeleri.
     *
     * @param id the id of the ureticiOdemeleri to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ureticiOdemeleri, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/uretici-odemeleris/{id}")
    public ResponseEntity<UreticiOdemeleri> getUreticiOdemeleri(@PathVariable Long id) {
        log.debug("REST request to get UreticiOdemeleri : {}", id);
        Optional<UreticiOdemeleri> ureticiOdemeleri = ureticiOdemeleriService.findOne(id);
        return ResponseUtil.wrapOrNotFound(ureticiOdemeleri);
    }

    /**
     * {@code DELETE  /uretici-odemeleris/:id} : delete the "id" ureticiOdemeleri.
     *
     * @param id the id of the ureticiOdemeleri to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/uretici-odemeleris/{id}")
    public ResponseEntity<Void> deleteUreticiOdemeleri(@PathVariable Long id) {
        log.debug("REST request to delete UreticiOdemeleri : {}", id);
        ureticiOdemeleriService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
