package com.koop.app.web.rest;

import com.koop.app.domain.KasaHareketleri;
import com.koop.app.repository.KasaHareketleriRepository;
import com.koop.app.web.rest.errors.BadRequestAlertException;
import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
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
 * REST controller for managing {@link com.koop.app.domain.KasaHareketleri}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class KasaHareketleriResource {
    private final Logger log = LoggerFactory.getLogger(KasaHareketleriResource.class);

    private static final String ENTITY_NAME = "kasaHareketleri";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final KasaHareketleriRepository kasaHareketleriRepository;

    public KasaHareketleriResource(KasaHareketleriRepository kasaHareketleriRepository) {
        this.kasaHareketleriRepository = kasaHareketleriRepository;
    }

    /**
     * {@code POST  /kasa-hareketleris} : Create a new kasaHareketleri.
     *
     * @param kasaHareketleri the kasaHareketleri to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new kasaHareketleri, or with status {@code 400 (Bad Request)} if the kasaHareketleri has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/kasa-hareketleris")
    public ResponseEntity<KasaHareketleri> createKasaHareketleri(@RequestBody KasaHareketleri kasaHareketleri) throws URISyntaxException {
        log.debug("REST request to save KasaHareketleri : {}", kasaHareketleri);
        if (kasaHareketleri.getId() != null) {
            throw new BadRequestAlertException("A new kasaHareketleri cannot already have an ID", ENTITY_NAME, "idexists");
        }
        KasaHareketleri result = kasaHareketleriRepository.save(kasaHareketleri);
        return ResponseEntity
            .created(new URI("/api/kasa-hareketleris/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /kasa-hareketleris} : Updates an existing kasaHareketleri.
     *
     * @param kasaHareketleri the kasaHareketleri to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated kasaHareketleri,
     * or with status {@code 400 (Bad Request)} if the kasaHareketleri is not valid,
     * or with status {@code 500 (Internal Server Error)} if the kasaHareketleri couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/kasa-hareketleris")
    public ResponseEntity<KasaHareketleri> updateKasaHareketleri(@RequestBody KasaHareketleri kasaHareketleri) throws URISyntaxException {
        log.debug("REST request to update KasaHareketleri : {}", kasaHareketleri);
        if (kasaHareketleri.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        KasaHareketleri result = kasaHareketleriRepository.save(kasaHareketleri);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, kasaHareketleri.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /kasa-hareketleris} : get all the kasaHareketleris.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of kasaHareketleris in body.
     */
    @GetMapping("/kasa-hareketleris")
    public ResponseEntity<List<KasaHareketleri>> getAllKasaHareketleris(Pageable pageable) {
        log.debug("REST request to get a page of KasaHareketleris");
        Page<KasaHareketleri> page = kasaHareketleriRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /kasa-hareketleris/:id} : get the "id" kasaHareketleri.
     *
     * @param id the id of the kasaHareketleri to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the kasaHareketleri, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/kasa-hareketleris/{id}")
    public ResponseEntity<KasaHareketleri> getKasaHareketleri(@PathVariable Long id) {
        log.debug("REST request to get KasaHareketleri : {}", id);
        Optional<KasaHareketleri> kasaHareketleri = kasaHareketleriRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(kasaHareketleri);
    }

    /**
     * {@code DELETE  /kasa-hareketleris/:id} : delete the "id" kasaHareketleri.
     *
     * @param id the id of the kasaHareketleri to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/kasa-hareketleris/{id}")
    public ResponseEntity<Void> deleteKasaHareketleri(@PathVariable Long id) {
        log.debug("REST request to delete KasaHareketleri : {}", id);
        kasaHareketleriRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
