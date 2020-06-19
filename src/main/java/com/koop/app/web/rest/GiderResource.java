package com.koop.app.web.rest;

import com.koop.app.domain.Gider;
import com.koop.app.domain.User;
import com.koop.app.domain.enumeration.OdemeAraci;
import com.koop.app.repository.GiderRepository;
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
 * REST controller for managing {@link com.koop.app.domain.Gider}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class GiderResource {
    private static final String ENTITY_NAME = "gider";
    private final Logger log = LoggerFactory.getLogger(GiderResource.class);
    private final GiderRepository giderRepository;
    private final UserService userService;
    private final KasaHareketleriService kasaHareketleriService;

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    public GiderResource(GiderRepository giderRepository, UserService userService, KasaHareketleriService kasaHareketleriService) {
        this.giderRepository = giderRepository;
        this.userService = userService;
        this.kasaHareketleriService = kasaHareketleriService;
    }

    /**
     * {@code POST  /giders} : Create a new gider.
     *
     * @param gider the gider to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new gider, or with status {@code 400 (Bad Request)} if the gider has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/giders")
    public ResponseEntity<Gider> createGider(@Valid @RequestBody Gider gider) throws URISyntaxException {
        log.debug("REST request to save Gider : {}", gider);
        if (gider.getId() != null) {
            throw new BadRequestAlertException("A new gider cannot already have an ID", ENTITY_NAME, "idexists");
        }

        User currentUser = userService.getCurrentUser();
        gider.setUser(currentUser);
        if (gider.getTarih() == null) gider.setTarih(ZonedDateTime.now());
        Gider result = giderRepository.save(gider);
        if (gider.getOdemeAraci() == OdemeAraci.NAKIT) {
            kasaHareketleriService.createKasaHareketi(gider.getTutar().negate(), "Kasadan Nakit Gider");
        }
        return ResponseEntity
            .created(new URI("/api/giders/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /giders} : Updates an existing gider.
     *
     * @param gider the gider to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated gider,
     * or with status {@code 400 (Bad Request)} if the gider is not valid,
     * or with status {@code 500 (Internal Server Error)} if the gider couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/giders")
    public ResponseEntity<Gider> updateGider(@Valid @RequestBody Gider gider) throws URISyntaxException {
        log.debug("REST request to update Gider : {}", gider);
        if (gider.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        User currentUser = userService.getCurrentUser();
        gider.setUser(currentUser);
        if (gider.getTarih() == null) gider.setTarih(ZonedDateTime.now());
        Gider oncekiGider = giderRepository.findById(gider.getId()).get();
        if (gider.getOdemeAraci() == OdemeAraci.NAKIT) {
            kasaHareketleriService.createKasaHareketi(
                gider.getTutar().subtract(oncekiGider.getTutar()).negate(),
                "Kasadan Nakit Gider Degisikligi"
            );
        }
        Gider result = giderRepository.save(gider);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, gider.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /giders} : get all the giders.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of giders in body.
     */
    @GetMapping("/giders")
    public ResponseEntity<List<Gider>> getAllGiders(Pageable pageable) {
        log.debug("REST request to get a page of Giders");
        Page<Gider> page = giderRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /giders/:id} : get the "id" gider.
     *
     * @param id the id of the gider to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the gider, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/giders/{id}")
    public ResponseEntity<Gider> getGider(@PathVariable Long id) {
        log.debug("REST request to get Gider : {}", id);
        Optional<Gider> gider = giderRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(gider);
    }

    /**
     * {@code DELETE  /giders/:id} : delete the "id" gider.
     *
     * @param id the id of the gider to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/giders/{id}")
    public ResponseEntity<Void> deleteGider(@PathVariable Long id) {
        log.debug("REST request to delete Gider : {}", id);
        giderRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code SEARCH  /_search/gider?query=:query} : search for the urun corresponding
     * to the query.
     *
     * @param query    the query of the gider search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/gider")
    public ResponseEntity<List<Gider>> searchGider(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Gider for query {}", query);
        Page<Gider> page = giderRepository.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @GetMapping(params = {"fromDate", "userId"}, path = "/giders/user-gider")
    public ResponseEntity<List<Gider>> getUserGiders(@RequestParam(value = "fromDate") String fromDate,
                                                     @RequestParam(value = "userId") String userId) {
        log.debug("REST request to get a list of user giders");
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate localDate = LocalDate.parse(fromDate, formatter);
        List<Gider> giderList = giderRepository.getUserGiders(localDate.atStartOfDay(ZoneId.systemDefault()),
            localDate.plusDays(1).atStartOfDay(ZoneId.systemDefault()), Long.valueOf(userId));
        return ResponseEntity.ok().body(giderList);
    }
}
