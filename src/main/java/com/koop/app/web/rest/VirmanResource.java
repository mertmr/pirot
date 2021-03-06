package com.koop.app.web.rest;

import com.koop.app.domain.User;
import com.koop.app.domain.Virman;
import com.koop.app.repository.VirmanRepository;
import com.koop.app.service.KasaHareketleriService;
import com.koop.app.service.UserService;
import com.koop.app.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
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
 * REST controller for managing {@link com.koop.app.domain.Virman}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class VirmanResource {
    private static final String ENTITY_NAME = "virman";
    private final Logger log = LoggerFactory.getLogger(VirmanResource.class);
    private final VirmanRepository virmanRepository;
    private final UserService userService;
    private final KasaHareketleriService kasaHareketleriService;

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    public VirmanResource(
        VirmanRepository virmanRepository,
        UserService userService,
        KasaHareketleriService kasaHareketleriService
    ) {
        this.virmanRepository = virmanRepository;
        this.userService = userService;
        this.kasaHareketleriService = kasaHareketleriService;
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
        User currentUser = userService.getCurrentUser();
        virman.setUser(currentUser);
        if (virman.getTarih() == null) {
            virman.setTarih(ZonedDateTime.now());
        }
        Virman result = virmanRepository.save(virman);
        kasaHareketleriService.createKasaHareketi(virman.getTutar().negate(), "Kasadan Virman Cikti");
        return ResponseEntity
            .created(new URI("/api/virmen/" + result.getId()))
            .headers(
                HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString())
            )
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
        User currentUser = userService.getCurrentUser();
        virman.setUser(currentUser);
        if (virman.getTarih() == null) {
            virman.setTarih(ZonedDateTime.now());
        }

        Optional<Virman> optionalVirman = virmanRepository.findById(virman.getId());
        Virman oncekiVirman = optionalVirman.orElseThrow(RuntimeException::new);
        kasaHareketleriService.createKasaHareketi(
            virman.getTutar().subtract(oncekiVirman.getTutar()).negate(),
            "Virmanda Düzenleme"
        );
        Virman result = virmanRepository.save(virman);
        return ResponseEntity
            .ok()
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
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(
            ServletUriComponentsBuilder.fromCurrentRequest(),
            page
        );
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
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /_search/virman?query=:query} : search for the urun corresponding
     * to the query.
     *
     * @param query    the query of the virman search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/virman")
    public ResponseEntity<List<Virman>> searchVirman(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Virman for query {}", query);
        Page<Virman> page = virmanRepository.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(
            ServletUriComponentsBuilder.fromCurrentRequest(),
            page
        );
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /user-virman} : bir kullanciya ait virmani getir
     *
     * @param fromDate sadece bu tarihli virmanlari getir
     * @param userId   sadece bu idli kullanici icin virmanlari getir
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of virman in body.
     */
    @GetMapping(params = { "fromDate", "userId" }, path = "/virmen/user-virman")
    public ResponseEntity<Virman> getUserVirman(
        @RequestParam(value = "fromDate") String fromDate,
        @RequestParam(value = "userId") Long userId
    ) {
        log.debug("REST request to get a user virman");
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate localDate = LocalDate.parse(fromDate, formatter);
        Virman userVirman = virmanRepository.getUserVirman(
            localDate.atStartOfDay(ZoneId.systemDefault()),
            localDate.plusDays(1).atStartOfDay(ZoneId.systemDefault()),
            userId
        );
        return ResponseEntity.ok().body(userVirman);
    }
}
