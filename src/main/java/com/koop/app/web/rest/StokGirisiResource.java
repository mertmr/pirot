package com.koop.app.web.rest;

import com.koop.app.domain.StokGirisi;
import com.koop.app.domain.Urun;
import com.koop.app.domain.User;
import com.koop.app.repository.StokGirisiRepository;
import com.koop.app.service.StokGirisiService;
import com.koop.app.service.UserService;
import com.koop.app.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
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
 * REST controller for managing {@link com.koop.app.domain.StokGirisi}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class StokGirisiResource {
    private static final String ENTITY_NAME = "stokGirisi";
    private final Logger log = LoggerFactory.getLogger(StokGirisiResource.class);
    private final StokGirisiRepository stokGirisiRepository;
    private final UserService userService;
    private final StokGirisiService stokGirisiService;

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    public StokGirisiResource(
        StokGirisiRepository stokGirisiRepository,
        UserService userService,
        StokGirisiService stokGirisiService
    ) {
        this.stokGirisiRepository = stokGirisiRepository;
        this.userService = userService;
        this.stokGirisiService = stokGirisiService;
    }

    /**
     * {@code POST  /stok-girisis} : Create a new stokGirisi.
     *
     * @param stokGirisi the stokGirisi to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new stokGirisi, or with status {@code 400 (Bad Request)} if the stokGirisi has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/stok-girisis")
    public ResponseEntity<StokGirisi> createStokGirisi(@Valid @RequestBody StokGirisi stokGirisi)
        throws URISyntaxException {
        log.debug("REST request to save StokGirisi : {}", stokGirisi);
        if (stokGirisi.getId() != null) {
            throw new BadRequestAlertException("A new stokGirisi cannot already have an ID", ENTITY_NAME, "idexists");
        }
        User currentUser = userService.getCurrentUser();
        stokGirisi.setUser(currentUser);
        if (stokGirisi.getTarih() == null) stokGirisi.setTarih(ZonedDateTime.now());
        StokGirisi result = stokGirisiService.save(stokGirisi);
        return ResponseEntity
            .created(new URI("/api/stok-girisis/" + result.getId()))
            .headers(
                HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString())
            )
            .body(result);
    }

    /**
     * {@code PUT  /stok-girisis} : Updates an existing stokGirisi.
     *
     * @param stokGirisi the stokGirisi to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated stokGirisi,
     * or with status {@code 400 (Bad Request)} if the stokGirisi is not valid,
     * or with status {@code 500 (Internal Server Error)} if the stokGirisi couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/stok-girisis")
    public ResponseEntity<StokGirisi> updateStokGirisi(@Valid @RequestBody StokGirisi stokGirisi)
        throws URISyntaxException {
        log.debug("REST request to update StokGirisi : {}", stokGirisi);
        if (stokGirisi.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        StokGirisi result = stokGirisiService.update(stokGirisi);
        return ResponseEntity
            .ok()
            .headers(
                HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, stokGirisi.getId().toString())
            )
            .body(result);
    }

    /**
     * {@code GET  /stok-girisis} : get all the stokGirisis.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of stokGirisis in body.
     */
    @GetMapping("/stok-girisis")
    public ResponseEntity<List<StokGirisi>> getAllStokGirisis(Pageable pageable) {
        log.debug("REST request to get a page of StokGirisis");
        Page<StokGirisi> page = stokGirisiRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(
            ServletUriComponentsBuilder.fromCurrentRequest(),
            page
        );
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /stok-girisis/:id} : get the "id" stokGirisi.
     *
     * @param id the id of the stokGirisi to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the stokGirisi, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/stok-girisis/{id}")
    public ResponseEntity<StokGirisi> getStokGirisi(@PathVariable Long id) {
        log.debug("REST request to get StokGirisi : {}", id);
        Optional<StokGirisi> stokGirisi = stokGirisiRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(stokGirisi);
    }

    /**
     * {@code DELETE  /stok-girisis/:id} : delete the "id" stokGirisi.
     *
     * @param id the id of the stokGirisi to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/stok-girisis/{id}")
    public ResponseEntity<Void> deleteStokGirisi(@PathVariable Long id) {
        log.debug("REST request to delete StokGirisi : {}", id);
        stokGirisiRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /searchStokGirisiByUrun?query=:query} : search for the urun corresponding
     * to the query.
     *
     * @param query    the query of the stok girisi search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/searchStokGirisiByUrun")
    public ResponseEntity<List<StokGirisi>> searchUruns(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Uruns for query {}", query);
        Page<StokGirisi> page = stokGirisiService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(
            ServletUriComponentsBuilder.fromCurrentRequest(),
            page
        );
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
