package com.koop.app.web.rest;

import com.koop.app.domain.Urun;
import com.koop.app.domain.UrunFiyat;
import com.koop.app.domain.User;
import com.koop.app.repository.UrunFiyatRepository;
import com.koop.app.repository.UrunRepository;
import com.koop.app.service.StockChangedException;
import com.koop.app.service.StockException;
import com.koop.app.service.UrunService;
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
 * REST controller for managing {@link com.koop.app.domain.Urun}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UrunResource {
    private static final String ENTITY_NAME = "urun";
    private final Logger log = LoggerFactory.getLogger(UrunResource.class);
    private final UrunRepository urunRepository;
    private final UserService userService;
    private final UrunService urunService;
    private final UrunFiyatRepository urunFiyatRepository;

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    public UrunResource(
        UrunRepository urunRepository,
        UserService userService,
        UrunService urunService,
        UrunFiyatRepository urunFiyatRepository
    ) {
        this.urunRepository = urunRepository;
        this.userService = userService;
        this.urunService = urunService;
        this.urunFiyatRepository = urunFiyatRepository;
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
        urun.setActive(true);
        Urun result = urunRepository.save(urun);
        if (urun.getId() != null) {
            Optional<Urun> oncekiHaliUrunOptional = urunRepository.findById(urun.getId());
            if (oncekiHaliUrunOptional.isPresent()) {
                Urun oncekiHaliUrun = oncekiHaliUrunOptional.get();
                if (oncekiHaliUrun.getMusteriFiyati().compareTo(urun.getMusteriFiyati()) != 0) {
                    User currentUser = userService.getCurrentUser();
                    createUrunFiyatEntry(urun, currentUser);
                }
            }
        }
        return ResponseEntity
            .created(new URI("/api/uruns/" + result.getId()))
            .headers(
                HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString())
            )
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
        Optional<Urun> urunOptional = urunRepository.findById(urun.getId());
        Urun oncekiUrun = urunOptional.orElseThrow(RuntimeException::new);
        double oncekiFiyat = oncekiUrun.getMusteriFiyati().doubleValue();

        User currentUser = userService.getCurrentUser();
        Urun result = urunRepository.save(urun);
        if (oncekiFiyat != result.getMusteriFiyati().doubleValue()) {
            createUrunFiyatEntry(urun, currentUser);
        }

        if(oncekiUrun.getStok() != null && oncekiUrun.getStok().compareTo(urun.getStok()) != 0) {
            throw new StockException();
        }
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, urun.getId().toString()))
            .body(result);
    }

    private void createUrunFiyatEntry(Urun urun, User currentUser) {
        UrunFiyat urunFiyat = new UrunFiyat();
        urunFiyat.setTarih(ZonedDateTime.now());
        urunFiyat.setUser(currentUser);
        urunFiyat.setFiyat(urun.getMusteriFiyati());
        urunFiyat.setUrun(urun);
        urunFiyatRepository.save(urunFiyat);
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
        Page<Urun> page = urunRepository.findEverything(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(
            ServletUriComponentsBuilder.fromCurrentRequest(),
            page
        );
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
        urunService.deleteUrun(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code GET  /satis} : get all the urun list for satis.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of urunler in body.
     */
    @GetMapping("/uruns/satis")
    public ResponseEntity<List<Urun>> getAllUrunForSatis() {
        log.debug("REST request to get a page of Satis");
        List<Urun> urunler = urunService.getAllUrunForSatis();
        return ResponseEntity.ok().body(urunler);
    }

    /**
     * {@code SEARCH  /_search/uruns?query=:query} : search for the urun corresponding
     * to the query.
     *
     * @param query    the query of the urun search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/uruns")
    public ResponseEntity<List<Urun>> searchUruns(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Uruns for query {}", query);
        Page<Urun> page = urunService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(
            ServletUriComponentsBuilder.fromCurrentRequest(),
            page
        );
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /satis} : get all the urun list for stok girisi.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of urunler in body.
     */
    @GetMapping("/uruns/stok-girisi")
    public ResponseEntity<List<Urun>> getAllUrunForStokGirisi() {
        log.debug("REST request to get a page of Satis");
        List<Urun> urunler = urunService.getAllUrunForStokGirisi();
        return ResponseEntity.ok().body(urunler);
    }
}
