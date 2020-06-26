package com.koop.app.web.rest;

import com.koop.app.domain.KdvKategorisi;
import com.koop.app.repository.KdvKategorisiRepository;
import com.koop.app.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import javax.validation.Valid;
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
 * REST controller for managing {@link com.koop.app.domain.KdvKategorisi}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class KdvKategorisiResource {
    private final Logger log = LoggerFactory.getLogger(KdvKategorisiResource.class);

    private static final String ENTITY_NAME = "kdvKategorisi";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final KdvKategorisiRepository kdvKategorisiRepository;

    public KdvKategorisiResource(KdvKategorisiRepository kdvKategorisiRepository) {
        this.kdvKategorisiRepository = kdvKategorisiRepository;
    }

    /**
     * {@code POST  /kdv-kategorisis} : Create a new kdvKategorisi.
     *
     * @param kdvKategorisi the kdvKategorisi to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new kdvKategorisi, or with status {@code 400 (Bad Request)} if the kdvKategorisi has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/kdv-kategorisis")
    public ResponseEntity<KdvKategorisi> createKdvKategorisi(@Valid @RequestBody KdvKategorisi kdvKategorisi)
        throws URISyntaxException {
        log.debug("REST request to save KdvKategorisi : {}", kdvKategorisi);
        if (kdvKategorisi.getId() != null) {
            throw new BadRequestAlertException(
                "A new kdvKategorisi cannot already have an ID",
                ENTITY_NAME,
                "idexists"
            );
        }
        KdvKategorisi result = kdvKategorisiRepository.save(kdvKategorisi);
        return ResponseEntity
            .created(new URI("/api/kdv-kategorisis/" + result.getId()))
            .headers(
                HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString())
            )
            .body(result);
    }

    /**
     * {@code PUT  /kdv-kategorisis} : Updates an existing kdvKategorisi.
     *
     * @param kdvKategorisi the kdvKategorisi to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated kdvKategorisi,
     * or with status {@code 400 (Bad Request)} if the kdvKategorisi is not valid,
     * or with status {@code 500 (Internal Server Error)} if the kdvKategorisi couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/kdv-kategorisis")
    public ResponseEntity<KdvKategorisi> updateKdvKategorisi(@Valid @RequestBody KdvKategorisi kdvKategorisi)
        throws URISyntaxException {
        log.debug("REST request to update KdvKategorisi : {}", kdvKategorisi);
        if (kdvKategorisi.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        KdvKategorisi result = kdvKategorisiRepository.save(kdvKategorisi);
        return ResponseEntity
            .ok()
            .headers(
                HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, kdvKategorisi.getId().toString())
            )
            .body(result);
    }

    /**
     * {@code GET  /kdv-kategorisis} : get all the kdvKategorisis.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of kdvKategorisis in body.
     */
    @GetMapping("/kdv-kategorisis")
    public ResponseEntity<List<KdvKategorisi>> getAllKdvKategorisis(Pageable pageable) {
        log.debug("REST request to get a page of KdvKategorisis");
        Page<KdvKategorisi> page = kdvKategorisiRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(
            ServletUriComponentsBuilder.fromCurrentRequest(),
            page
        );
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /kdv-kategorisis/:id} : get the "id" kdvKategorisi.
     *
     * @param id the id of the kdvKategorisi to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the kdvKategorisi, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/kdv-kategorisis/{id}")
    public ResponseEntity<KdvKategorisi> getKdvKategorisi(@PathVariable Long id) {
        log.debug("REST request to get KdvKategorisi : {}", id);
        Optional<KdvKategorisi> kdvKategorisi = kdvKategorisiRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(kdvKategorisi);
    }

    /**
     * {@code DELETE  /kdv-kategorisis/:id} : delete the "id" kdvKategorisi.
     *
     * @param id the id of the kdvKategorisi to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/kdv-kategorisis/{id}")
    public ResponseEntity<Void> deleteKdvKategorisi(@PathVariable Long id) {
        log.debug("REST request to delete KdvKategorisi : {}", id);
        kdvKategorisiRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
