package com.koop.app.web.rest;

import com.koop.app.domain.Urun;
import com.koop.app.domain.User;
import com.koop.app.repository.UrunRepository;
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

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.koop.app.domain.Urun}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UrunResource {

    private final Logger log = LoggerFactory.getLogger(UrunResource.class);

    private static final String ENTITY_NAME = "urun";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UrunRepository urunRepository;

    private final UserService userService;

    public UrunResource(UrunRepository urunRepository, UserService userService) {
        this.urunRepository = urunRepository;
        this.userService = userService;
    }

    /**
     * {@code POST  /uruns} : Create a new urun.
     *
     * @param urun the urun to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new urun, or with status {@code 400 (Bad Request)} if the urun has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/uruns")
    public ResponseEntity<Urun> createUrun(@Valid @RequestBody Urun urun) throws URISyntaxException {
        log.debug("REST request to save Urun : {}", urun);
        if (urun.getId() != null) {
            throw new BadRequestAlertException("A new urun cannot already have an ID", ENTITY_NAME, "idexists");
        }
        User currentUser = userService.getCurrentUser();
        urun.setUser(currentUser);
        Urun result = urunRepository.save(urun);
        return ResponseEntity.created(new URI("/api/uruns/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /uruns} : Updates an existing urun.
     *
     * @param urun the urun to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated urun,
     * or with status {@code 400 (Bad Request)} if the urun is not valid,
     * or with status {@code 500 (Internal Server Error)} if the urun couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/uruns")
    public ResponseEntity<Urun> updateUrun(@Valid @RequestBody Urun urun) throws URISyntaxException {
        log.debug("REST request to update Urun : {}", urun);
        if (urun.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        User currentUser = userService.getCurrentUser();
        urun.setUser(currentUser);
        Urun result = urunRepository.save(urun);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, urun.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /uruns} : get all the uruns.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of uruns in body.
     */
    @GetMapping("/uruns")
    public ResponseEntity<List<Urun>> getAllUruns(Pageable pageable) {
        log.debug("REST request to get a page of Uruns");
        Page<Urun> page = urunRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /uruns/:id} : get the "id" urun.
     *
     * @param id the id of the urun to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the urun, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/uruns/{id}")
    public ResponseEntity<Urun> getUrun(@PathVariable Long id) {
        log.debug("REST request to get Urun : {}", id);
        Optional<Urun> urun = urunRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(urun);
    }

    /**
     * {@code DELETE  /uruns/:id} : delete the "id" urun.
     *
     * @param id the id of the urun to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/uruns/{id}")
    public ResponseEntity<Void> deleteUrun(@PathVariable Long id) {
        log.debug("REST request to delete Urun : {}", id);
        urunRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
