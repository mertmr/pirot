package com.koop.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.koop.app.KoopApp;
import com.koop.app.domain.SatisStokHareketleri;
import com.koop.app.repository.SatisStokHareketleriRepository;
import java.math.BigDecimal;
import java.util.List;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link SatisStokHareketleriResource} REST controller.
 */
@SpringBootTest(classes = KoopApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class SatisStokHareketleriResourceIT {
    private static final Integer DEFAULT_MIKTAR = 1;
    private static final Integer UPDATED_MIKTAR = 2;

    private static final BigDecimal DEFAULT_TUTAR = new BigDecimal(1);
    private static final BigDecimal UPDATED_TUTAR = new BigDecimal(2);

    @Autowired
    private SatisStokHareketleriRepository satisStokHareketleriRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSatisStokHareketleriMockMvc;

    private SatisStokHareketleri satisStokHareketleri;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SatisStokHareketleri createEntity(EntityManager em) {
        SatisStokHareketleri satisStokHareketleri = new SatisStokHareketleri()
            .miktar(DEFAULT_MIKTAR)
            .tutar(DEFAULT_TUTAR)
            .urun(UrunResourceIT.createEntity(em));
        return satisStokHareketleri;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SatisStokHareketleri createUpdatedEntity(EntityManager em) {
        SatisStokHareketleri satisStokHareketleri = new SatisStokHareketleri()
            .miktar(UPDATED_MIKTAR)
            .tutar(UPDATED_TUTAR);
        return satisStokHareketleri;
    }

    @BeforeEach
    public void initTest() {
        satisStokHareketleri = createEntity(em);
    }

    @Test
    @Transactional
    @WithMockUser(value = "admin")
    public void createSatisStokHareketleri() throws Exception {
        int databaseSizeBeforeCreate = satisStokHareketleriRepository.findAll().size();
        // Create the SatisStokHareketleri
        restSatisStokHareketleriMockMvc
            .perform(
                post("/api/satis-stok-hareketleris")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(satisStokHareketleri))
            )
            .andExpect(status().isCreated());

        // Validate the SatisStokHareketleri in the database
        List<SatisStokHareketleri> satisStokHareketleriList = satisStokHareketleriRepository.findAll();
        assertThat(satisStokHareketleriList).hasSize(databaseSizeBeforeCreate + 1);
        SatisStokHareketleri testSatisStokHareketleri = satisStokHareketleriList.get(
            satisStokHareketleriList.size() - 1
        );
        assertThat(testSatisStokHareketleri.getMiktar()).isEqualTo(DEFAULT_MIKTAR);
        assertThat(testSatisStokHareketleri.getTutar()).isEqualTo(DEFAULT_TUTAR);
    }

    @Test
    @Transactional
    public void createSatisStokHareketleriWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = satisStokHareketleriRepository.findAll().size();

        // Create the SatisStokHareketleri with an existing ID
        satisStokHareketleri.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSatisStokHareketleriMockMvc
            .perform(
                post("/api/satis-stok-hareketleris")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(satisStokHareketleri))
            )
            .andExpect(status().isBadRequest());

        // Validate the SatisStokHareketleri in the database
        List<SatisStokHareketleri> satisStokHareketleriList = satisStokHareketleriRepository.findAll();
        assertThat(satisStokHareketleriList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkMiktarIsRequired() throws Exception {
        int databaseSizeBeforeTest = satisStokHareketleriRepository.findAll().size();
        // set the field null
        satisStokHareketleri.setMiktar(null);

        // Create the SatisStokHareketleri, which fails.

        restSatisStokHareketleriMockMvc
            .perform(
                post("/api/satis-stok-hareketleris")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(satisStokHareketleri))
            )
            .andExpect(status().isBadRequest());

        List<SatisStokHareketleri> satisStokHareketleriList = satisStokHareketleriRepository.findAll();
        assertThat(satisStokHareketleriList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkTutarIsRequired() throws Exception {
        int databaseSizeBeforeTest = satisStokHareketleriRepository.findAll().size();
        // set the field null
        satisStokHareketleri.setTutar(null);

        // Create the SatisStokHareketleri, which fails.

        restSatisStokHareketleriMockMvc
            .perform(
                post("/api/satis-stok-hareketleris")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(satisStokHareketleri))
            )
            .andExpect(status().isBadRequest());

        List<SatisStokHareketleri> satisStokHareketleriList = satisStokHareketleriRepository.findAll();
        assertThat(satisStokHareketleriList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    @WithMockUser(value = "admin")
    public void getAllSatisStokHareketleris() throws Exception {
        // Initialize the database
        satisStokHareketleri.setUrun(null);
        satisStokHareketleriRepository.saveAndFlush(satisStokHareketleri);

        // Get all the satisStokHareketleriList
        restSatisStokHareketleriMockMvc
            .perform(get("/api/satis-stok-hareketleris?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(satisStokHareketleri.getId().intValue())))
            .andExpect(jsonPath("$.[*].miktar").value(hasItem(DEFAULT_MIKTAR)))
            .andExpect(jsonPath("$.[*].tutar").value(hasItem(DEFAULT_TUTAR.intValue())));
    }

    @Test
    @Transactional
    public void getSatisStokHareketleri() throws Exception {
        // Initialize the database
        satisStokHareketleri.setUrun(null);
        satisStokHareketleriRepository.saveAndFlush(satisStokHareketleri);

        // Get the satisStokHareketleri
        restSatisStokHareketleriMockMvc
            .perform(get("/api/satis-stok-hareketleris/{id}", satisStokHareketleri.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(satisStokHareketleri.getId().intValue()))
            .andExpect(jsonPath("$.miktar").value(DEFAULT_MIKTAR))
            .andExpect(jsonPath("$.tutar").value(DEFAULT_TUTAR.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingSatisStokHareketleri() throws Exception {
        // Get the satisStokHareketleri
        restSatisStokHareketleriMockMvc
            .perform(get("/api/satis-stok-hareketleris/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    @WithMockUser(value = "admin")
    public void updateSatisStokHareketleri() throws Exception {
        // Initialize the database
        satisStokHareketleri.setUrun(null);
        satisStokHareketleriRepository.saveAndFlush(satisStokHareketleri);

        int databaseSizeBeforeUpdate = satisStokHareketleriRepository.findAll().size();

        // Update the satisStokHareketleri
        SatisStokHareketleri updatedSatisStokHareketleri = satisStokHareketleriRepository
            .findById(satisStokHareketleri.getId())
            .get();
        // Disconnect from session so that the updates on updatedSatisStokHareketleri are not directly saved in db
        em.detach(updatedSatisStokHareketleri);
        updatedSatisStokHareketleri.miktar(UPDATED_MIKTAR).tutar(UPDATED_TUTAR);

        restSatisStokHareketleriMockMvc
            .perform(
                put("/api/satis-stok-hareketleris")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSatisStokHareketleri))
            )
            .andExpect(status().isOk());

        // Validate the SatisStokHareketleri in the database
        List<SatisStokHareketleri> satisStokHareketleriList = satisStokHareketleriRepository.findAll();
        assertThat(satisStokHareketleriList).hasSize(databaseSizeBeforeUpdate);
        SatisStokHareketleri testSatisStokHareketleri = satisStokHareketleriList.get(
            satisStokHareketleriList.size() - 1
        );
        assertThat(testSatisStokHareketleri.getMiktar()).isEqualTo(UPDATED_MIKTAR);
        assertThat(testSatisStokHareketleri.getTutar()).isEqualTo(UPDATED_TUTAR);
    }

    @Test
    @Transactional
    public void updateNonExistingSatisStokHareketleri() throws Exception {
        int databaseSizeBeforeUpdate = satisStokHareketleriRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSatisStokHareketleriMockMvc
            .perform(
                put("/api/satis-stok-hareketleris")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(satisStokHareketleri))
            )
            .andExpect(status().isBadRequest());

        // Validate the SatisStokHareketleri in the database
        List<SatisStokHareketleri> satisStokHareketleriList = satisStokHareketleriRepository.findAll();
        assertThat(satisStokHareketleriList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    @WithMockUser(value = "admin")
    public void deleteSatisStokHareketleri() throws Exception {
        // Initialize the database
        satisStokHareketleri.setUrun(null);
        satisStokHareketleriRepository.saveAndFlush(satisStokHareketleri);

        int databaseSizeBeforeDelete = satisStokHareketleriRepository.findAll().size();

        // Delete the satisStokHareketleri
        restSatisStokHareketleriMockMvc
            .perform(
                delete("/api/satis-stok-hareketleris/{id}", satisStokHareketleri.getId())
                    .accept(MediaType.APPLICATION_JSON)
            )
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SatisStokHareketleri> satisStokHareketleriList = satisStokHareketleriRepository.findAll();
        assertThat(satisStokHareketleriList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
