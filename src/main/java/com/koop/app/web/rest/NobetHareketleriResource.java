package com.koop.app.web.rest;

import com.koop.app.domain.NobetHareketleri;
import com.koop.app.domain.User;
import com.koop.app.repository.NobetHareketleriRepository;
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
 * REST controller for managing {@link com.koop.app.domain.NobetHareketleri}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class NobetHareketleriResource {

    private final Logger log = LoggerFactory.getLogger(NobetHareketleriResource.class);

    private static final String ENTITY_NAME = "nobetHareketleri";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final NobetHareketleriRepository nobetHareketleriRepository;

    private final UserService userService;

    public NobetHareketleriResource(NobetHareketleriRepository nobetHareketleriRepository, UserService userService) {
        this.nobetHareketleriRepository = nobetHareketleriRepository;
        this.userService = userService;
    }

    /**
     * {@code POST  /nobet-hareketleris} : Create a new nobetHareketleri.
     *
     * @param nobetHareketleri the nobetHareketleri to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new nobetHareketleri, or with status {@code 400 (Bad Request)} if the nobetHareketleri has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/nobet-hareketleris")
    public ResponseEntity<NobetHareketleri> createNobetHareketleri(@RequestBody NobetHareketleri nobetHareketleri) throws URISyntaxException {
        log.debug("REST request to save NobetHareketleri : {}", nobetHareketleri);
        if (nobetHareketleri.getId() != null) {
            throw new BadRequestAlertException("A new nobetHareketleri cannot already have an ID", ENTITY_NAME, "idexists");
        }
        if (nobetHareketleri.getTarih() == null) {
            nobetHareketleri.setTarih(ZonedDateTime.now());
        }
        User currentUser = userService.getCurrentUser();
        nobetHareketleri.setUser(currentUser);
        NobetHareketleri result = nobetHareketleriRepository.save(nobetHareketleri);
        return ResponseEntity.created(new URI("/api/nobet-hareketleris/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /nobet-hareketleris} : Updates an existing nobetHareketleri.
     *
     * @param nobetHareketleri the nobetHareketleri to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated nobetHareketleri,
     * or with status {@code 400 (Bad Request)} if the nobetHareketleri is not valid,
     * or with status {@code 500 (Internal Server Error)} if the nobetHareketleri couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/nobet-hareketleris")
    public ResponseEntity<NobetHareketleri> updateNobetHareketleri(@RequestBody NobetHareketleri nobetHareketleri) throws URISyntaxException {
        log.debug("REST request to update NobetHareketleri : {}", nobetHareketleri);
        if (nobetHareketleri.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (nobetHareketleri.getTarih() == null) {
            nobetHareketleri.setTarih(ZonedDateTime.now());
        }
        User currentUser = userService.getCurrentUser();
        nobetHareketleri.setUser(currentUser);
        NobetHareketleri result = nobetHareketleriRepository.save(nobetHareketleri);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, nobetHareketleri.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /nobet-hareketleris} : get all the nobetHareketleris.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of nobetHareketleris in body.
     */
    @GetMapping("/nobet-hareketleris")
    public ResponseEntity<List<NobetHareketleri>> getAllNobetHareketleris(Pageable pageable) {
        log.debug("REST request to get a page of NobetHareketleris");
        Page<NobetHareketleri> page = nobetHareketleriRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /nobet-hareketleris/:id} : get the "id" nobetHareketleri.
     *
     * @param id the id of the nobetHareketleri to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the nobetHareketleri, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/nobet-hareketleris/{id}")
    public ResponseEntity<NobetHareketleri> getNobetHareketleri(@PathVariable Long id) {
        log.debug("REST request to get NobetHareketleri : {}", id);
        Optional<NobetHareketleri> nobetHareketleri = nobetHareketleriRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(nobetHareketleri);
    }

    /**
     * {@code DELETE  /nobet-hareketleris/:id} : delete the "id" nobetHareketleri.
     *
     * @param id the id of the nobetHareketleri to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/nobet-hareketleris/{id}")
    public ResponseEntity<Void> deleteNobetHareketleri(@PathVariable Long id) {
        log.debug("REST request to delete NobetHareketleri : {}", id);
        nobetHareketleriRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
