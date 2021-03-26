package com.koop.app.web.rest;

import com.koop.app.KoopApp;
import com.koop.app.domain.BorcAlacak;
import com.koop.app.repository.BorcAlacakRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;

import static com.koop.app.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.koop.app.domain.enumeration.OdemeAraci;
import com.koop.app.domain.enumeration.HareketTipi;
/**
 * Integration tests for the {@link BorcAlacakResource} REST controller.
 */
@SpringBootTest(classes = KoopApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class BorcAlacakResourceIT {

    private static final BigDecimal DEFAULT_TUTAR = new BigDecimal(1);
    private static final BigDecimal UPDATED_TUTAR = new BigDecimal(2);

    private static final String DEFAULT_NOTLAR = "AAAAAAAAAA";
    private static final String UPDATED_NOTLAR = "BBBBBBBBBB";

    private static final OdemeAraci DEFAULT_ODEME_ARACI = OdemeAraci.NAKIT;
    private static final OdemeAraci UPDATED_ODEME_ARACI = OdemeAraci.BANKA;

    private static final HareketTipi DEFAULT_HAREKET_TIPI = HareketTipi.URUN_GIRISI;
    private static final HareketTipi UPDATED_HAREKET_TIPI = HareketTipi.ODEME;

    private static final ZonedDateTime DEFAULT_TARIH = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TARIH = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private BorcAlacakRepository borcAlacakRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBorcAlacakMockMvc;

    private BorcAlacak borcAlacak;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BorcAlacak createEntity(EntityManager em) {
        BorcAlacak borcAlacak = new BorcAlacak()
            .tutar(DEFAULT_TUTAR)
            .notlar(DEFAULT_NOTLAR)
            .odemeAraci(DEFAULT_ODEME_ARACI)
            .hareketTipi(DEFAULT_HAREKET_TIPI)
            .tarih(DEFAULT_TARIH);
        return borcAlacak;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BorcAlacak createUpdatedEntity(EntityManager em) {
        BorcAlacak borcAlacak = new BorcAlacak()
            .tutar(UPDATED_TUTAR)
            .notlar(UPDATED_NOTLAR)
            .odemeAraci(UPDATED_ODEME_ARACI)
            .hareketTipi(UPDATED_HAREKET_TIPI)
            .tarih(UPDATED_TARIH);
        return borcAlacak;
    }

    @BeforeEach
    public void initTest() {
        borcAlacak = createEntity(em);
    }

    @Test
    @Transactional
    public void createBorcAlacak() throws Exception {
        int databaseSizeBeforeCreate = borcAlacakRepository.findAll().size();
        // Create the BorcAlacak
        restBorcAlacakMockMvc.perform(post("/api/borc-alacaks")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(borcAlacak)))
            .andExpect(status().isCreated());

        // Validate the BorcAlacak in the database
        List<BorcAlacak> borcAlacakList = borcAlacakRepository.findAll();
        assertThat(borcAlacakList).hasSize(databaseSizeBeforeCreate + 1);
        BorcAlacak testBorcAlacak = borcAlacakList.get(borcAlacakList.size() - 1);
        assertThat(testBorcAlacak.getTutar()).isEqualTo(DEFAULT_TUTAR);
        assertThat(testBorcAlacak.getNotlar()).isEqualTo(DEFAULT_NOTLAR);
        assertThat(testBorcAlacak.getOdemeAraci()).isEqualTo(DEFAULT_ODEME_ARACI);
        assertThat(testBorcAlacak.getHareketTipi()).isEqualTo(DEFAULT_HAREKET_TIPI);
        assertThat(testBorcAlacak.getTarih()).isEqualTo(DEFAULT_TARIH);
    }

    @Test
    @Transactional
    public void createBorcAlacakWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = borcAlacakRepository.findAll().size();

        // Create the BorcAlacak with an existing ID
        borcAlacak.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restBorcAlacakMockMvc.perform(post("/api/borc-alacaks")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(borcAlacak)))
            .andExpect(status().isBadRequest());

        // Validate the BorcAlacak in the database
        List<BorcAlacak> borcAlacakList = borcAlacakRepository.findAll();
        assertThat(borcAlacakList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllBorcAlacaks() throws Exception {
        // Initialize the database
        borcAlacakRepository.saveAndFlush(borcAlacak);

        // Get all the borcAlacakList
        restBorcAlacakMockMvc.perform(get("/api/borc-alacaks?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(borcAlacak.getId().intValue())))
            .andExpect(jsonPath("$.[*].tutar").value(hasItem(DEFAULT_TUTAR.intValue())))
            .andExpect(jsonPath("$.[*].notlar").value(hasItem(DEFAULT_NOTLAR)))
            .andExpect(jsonPath("$.[*].odemeAraci").value(hasItem(DEFAULT_ODEME_ARACI.toString())))
            .andExpect(jsonPath("$.[*].hareketTipi").value(hasItem(DEFAULT_HAREKET_TIPI.toString())))
            .andExpect(jsonPath("$.[*].tarih").value(hasItem(sameInstant(DEFAULT_TARIH))));
    }
    
    @Test
    @Transactional
    public void getBorcAlacak() throws Exception {
        // Initialize the database
        borcAlacakRepository.saveAndFlush(borcAlacak);

        // Get the borcAlacak
        restBorcAlacakMockMvc.perform(get("/api/borc-alacaks/{id}", borcAlacak.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(borcAlacak.getId().intValue()))
            .andExpect(jsonPath("$.tutar").value(DEFAULT_TUTAR.intValue()))
            .andExpect(jsonPath("$.notlar").value(DEFAULT_NOTLAR))
            .andExpect(jsonPath("$.odemeAraci").value(DEFAULT_ODEME_ARACI.toString()))
            .andExpect(jsonPath("$.hareketTipi").value(DEFAULT_HAREKET_TIPI.toString()))
            .andExpect(jsonPath("$.tarih").value(sameInstant(DEFAULT_TARIH)));
    }
    @Test
    @Transactional
    public void getNonExistingBorcAlacak() throws Exception {
        // Get the borcAlacak
        restBorcAlacakMockMvc.perform(get("/api/borc-alacaks/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateBorcAlacak() throws Exception {
        // Initialize the database
        borcAlacakRepository.saveAndFlush(borcAlacak);

        int databaseSizeBeforeUpdate = borcAlacakRepository.findAll().size();

        // Update the borcAlacak
        BorcAlacak updatedBorcAlacak = borcAlacakRepository.findById(borcAlacak.getId()).get();
        // Disconnect from session so that the updates on updatedBorcAlacak are not directly saved in db
        em.detach(updatedBorcAlacak);
        updatedBorcAlacak
            .tutar(UPDATED_TUTAR)
            .notlar(UPDATED_NOTLAR)
            .odemeAraci(UPDATED_ODEME_ARACI)
            .hareketTipi(UPDATED_HAREKET_TIPI)
            .tarih(UPDATED_TARIH);

        restBorcAlacakMockMvc.perform(put("/api/borc-alacaks")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedBorcAlacak)))
            .andExpect(status().isOk());

        // Validate the BorcAlacak in the database
        List<BorcAlacak> borcAlacakList = borcAlacakRepository.findAll();
        assertThat(borcAlacakList).hasSize(databaseSizeBeforeUpdate);
        BorcAlacak testBorcAlacak = borcAlacakList.get(borcAlacakList.size() - 1);
        assertThat(testBorcAlacak.getTutar()).isEqualTo(UPDATED_TUTAR);
        assertThat(testBorcAlacak.getNotlar()).isEqualTo(UPDATED_NOTLAR);
        assertThat(testBorcAlacak.getOdemeAraci()).isEqualTo(UPDATED_ODEME_ARACI);
        assertThat(testBorcAlacak.getHareketTipi()).isEqualTo(UPDATED_HAREKET_TIPI);
        assertThat(testBorcAlacak.getTarih()).isEqualTo(UPDATED_TARIH);
    }

    @Test
    @Transactional
    public void updateNonExistingBorcAlacak() throws Exception {
        int databaseSizeBeforeUpdate = borcAlacakRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBorcAlacakMockMvc.perform(put("/api/borc-alacaks")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(borcAlacak)))
            .andExpect(status().isBadRequest());

        // Validate the BorcAlacak in the database
        List<BorcAlacak> borcAlacakList = borcAlacakRepository.findAll();
        assertThat(borcAlacakList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteBorcAlacak() throws Exception {
        // Initialize the database
        borcAlacakRepository.saveAndFlush(borcAlacak);

        int databaseSizeBeforeDelete = borcAlacakRepository.findAll().size();

        // Delete the borcAlacak
        restBorcAlacakMockMvc.perform(delete("/api/borc-alacaks/{id}", borcAlacak.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<BorcAlacak> borcAlacakList = borcAlacakRepository.findAll();
        assertThat(borcAlacakList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
