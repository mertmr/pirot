package com.koop.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.koop.app.KoopApp;
import com.koop.app.domain.UrunFiyatHesap;
import com.koop.app.repository.UrunFiyatHesapRepository;
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
 * Integration tests for the {@link UrunFiyatHesapResource} REST controller.
 */
@SpringBootTest(classes = KoopApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class UrunFiyatHesapResourceIT {
    private static final Integer DEFAULT_AMORTISMAN = 1;
    private static final Integer UPDATED_AMORTISMAN = 2;

    private static final Integer DEFAULT_GIDER_PUSULA_MUSTAHSIL = 1;
    private static final Integer UPDATED_GIDER_PUSULA_MUSTAHSIL = 2;

    private static final Integer DEFAULT_DUKKAN_GIDER = 1;
    private static final Integer UPDATED_DUKKAN_GIDER = 2;

    private static final Integer DEFAULT_KOOPERATIF_CALISMA = 1;
    private static final Integer UPDATED_KOOPERATIF_CALISMA = 2;

    private static final Integer DEFAULT_DAYANISMA = 1;
    private static final Integer UPDATED_DAYANISMA = 2;

    private static final Integer DEFAULT_FIRE = 1;
    private static final Integer UPDATED_FIRE = 2;

    @Autowired
    private UrunFiyatHesapRepository urunFiyatHesapRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUrunFiyatHesapMockMvc;

    private UrunFiyatHesap urunFiyatHesap;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UrunFiyatHesap createEntity(EntityManager em) {
        UrunFiyatHesap urunFiyatHesap = new UrunFiyatHesap()
            .amortisman(DEFAULT_AMORTISMAN)
            .giderPusulaMustahsil(DEFAULT_GIDER_PUSULA_MUSTAHSIL)
            .dukkanGider(DEFAULT_DUKKAN_GIDER)
            .kooperatifCalisma(DEFAULT_KOOPERATIF_CALISMA)
            .dayanisma(DEFAULT_DAYANISMA)
            .fire(DEFAULT_FIRE);
        return urunFiyatHesap;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UrunFiyatHesap createUpdatedEntity(EntityManager em) {
        UrunFiyatHesap urunFiyatHesap = new UrunFiyatHesap()
            .amortisman(UPDATED_AMORTISMAN)
            .giderPusulaMustahsil(UPDATED_GIDER_PUSULA_MUSTAHSIL)
            .dukkanGider(UPDATED_DUKKAN_GIDER)
            .kooperatifCalisma(UPDATED_KOOPERATIF_CALISMA)
            .dayanisma(UPDATED_DAYANISMA)
            .fire(UPDATED_FIRE);
        return urunFiyatHesap;
    }

    @BeforeEach
    public void initTest() {
        urunFiyatHesap = createEntity(em);
    }

    @Test
    @Transactional
    public void createUrunFiyatHesap() throws Exception {
        int databaseSizeBeforeCreate = urunFiyatHesapRepository.findAll().size();
        // Create the UrunFiyatHesap
        restUrunFiyatHesapMockMvc
            .perform(
                post("/api/urun-fiyat-hesaps")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(urunFiyatHesap))
            )
            .andExpect(status().isCreated());

        // Validate the UrunFiyatHesap in the database
        List<UrunFiyatHesap> urunFiyatHesapList = urunFiyatHesapRepository.findAll();
        assertThat(urunFiyatHesapList).hasSize(databaseSizeBeforeCreate + 1);
        UrunFiyatHesap testUrunFiyatHesap = urunFiyatHesapList.get(urunFiyatHesapList.size() - 1);
        assertThat(testUrunFiyatHesap.getAmortisman()).isEqualTo(DEFAULT_AMORTISMAN);
        assertThat(testUrunFiyatHesap.getGiderPusulaMustahsil()).isEqualTo(DEFAULT_GIDER_PUSULA_MUSTAHSIL);
        assertThat(testUrunFiyatHesap.getDukkanGider()).isEqualTo(DEFAULT_DUKKAN_GIDER);
        assertThat(testUrunFiyatHesap.getKooperatifCalisma()).isEqualTo(DEFAULT_KOOPERATIF_CALISMA);
        assertThat(testUrunFiyatHesap.getDayanisma()).isEqualTo(DEFAULT_DAYANISMA);
        assertThat(testUrunFiyatHesap.getFire()).isEqualTo(DEFAULT_FIRE);
    }

    @Test
    @Transactional
    public void createUrunFiyatHesapWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = urunFiyatHesapRepository.findAll().size();

        // Create the UrunFiyatHesap with an existing ID
        urunFiyatHesap.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restUrunFiyatHesapMockMvc
            .perform(
                post("/api/urun-fiyat-hesaps")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(urunFiyatHesap))
            )
            .andExpect(status().isBadRequest());

        // Validate the UrunFiyatHesap in the database
        List<UrunFiyatHesap> urunFiyatHesapList = urunFiyatHesapRepository.findAll();
        assertThat(urunFiyatHesapList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllUrunFiyatHesaps() throws Exception {
        // Initialize the database
        urunFiyatHesapRepository.saveAndFlush(urunFiyatHesap);

        // Get all the urunFiyatHesapList
        restUrunFiyatHesapMockMvc
            .perform(get("/api/urun-fiyat-hesaps?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(urunFiyatHesap.getId().intValue())))
            .andExpect(jsonPath("$.[*].amortisman").value(hasItem(DEFAULT_AMORTISMAN)))
            .andExpect(jsonPath("$.[*].giderPusulaMustahsil").value(hasItem(DEFAULT_GIDER_PUSULA_MUSTAHSIL)))
            .andExpect(jsonPath("$.[*].dukkanGider").value(hasItem(DEFAULT_DUKKAN_GIDER)))
            .andExpect(jsonPath("$.[*].kooperatifCalisma").value(hasItem(DEFAULT_KOOPERATIF_CALISMA)))
            .andExpect(jsonPath("$.[*].dayanisma").value(hasItem(DEFAULT_DAYANISMA)))
            .andExpect(jsonPath("$.[*].fire").value(hasItem(DEFAULT_FIRE)));
    }

    @Test
    @Transactional
    public void getUrunFiyatHesap() throws Exception {
        // Initialize the database
        urunFiyatHesapRepository.saveAndFlush(urunFiyatHesap);

        // Get the urunFiyatHesap
        restUrunFiyatHesapMockMvc
            .perform(get("/api/urun-fiyat-hesaps/{id}", urunFiyatHesap.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(urunFiyatHesap.getId().intValue()))
            .andExpect(jsonPath("$.amortisman").value(DEFAULT_AMORTISMAN))
            .andExpect(jsonPath("$.giderPusulaMustahsil").value(DEFAULT_GIDER_PUSULA_MUSTAHSIL))
            .andExpect(jsonPath("$.dukkanGider").value(DEFAULT_DUKKAN_GIDER))
            .andExpect(jsonPath("$.kooperatifCalisma").value(DEFAULT_KOOPERATIF_CALISMA))
            .andExpect(jsonPath("$.dayanisma").value(DEFAULT_DAYANISMA))
            .andExpect(jsonPath("$.fire").value(DEFAULT_FIRE));
    }

    @Test
    @Transactional
    public void getNonExistingUrunFiyatHesap() throws Exception {
        // Get the urunFiyatHesap
        restUrunFiyatHesapMockMvc
            .perform(get("/api/urun-fiyat-hesaps/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateUrunFiyatHesap() throws Exception {
        // Initialize the database
        urunFiyatHesapRepository.saveAndFlush(urunFiyatHesap);

        int databaseSizeBeforeUpdate = urunFiyatHesapRepository.findAll().size();

        // Update the urunFiyatHesap
        UrunFiyatHesap updatedUrunFiyatHesap = urunFiyatHesapRepository.findById(urunFiyatHesap.getId()).get();
        // Disconnect from session so that the updates on updatedUrunFiyatHesap are not directly saved in db
        em.detach(updatedUrunFiyatHesap);
        updatedUrunFiyatHesap
            .amortisman(UPDATED_AMORTISMAN)
            .giderPusulaMustahsil(UPDATED_GIDER_PUSULA_MUSTAHSIL)
            .dukkanGider(UPDATED_DUKKAN_GIDER)
            .kooperatifCalisma(UPDATED_KOOPERATIF_CALISMA)
            .dayanisma(UPDATED_DAYANISMA)
            .fire(UPDATED_FIRE);

        restUrunFiyatHesapMockMvc
            .perform(
                put("/api/urun-fiyat-hesaps")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUrunFiyatHesap))
            )
            .andExpect(status().isOk());

        // Validate the UrunFiyatHesap in the database
        List<UrunFiyatHesap> urunFiyatHesapList = urunFiyatHesapRepository.findAll();
        assertThat(urunFiyatHesapList).hasSize(databaseSizeBeforeUpdate);
        UrunFiyatHesap testUrunFiyatHesap = urunFiyatHesapList.get(urunFiyatHesapList.size() - 1);
        assertThat(testUrunFiyatHesap.getAmortisman()).isEqualTo(UPDATED_AMORTISMAN);
        assertThat(testUrunFiyatHesap.getGiderPusulaMustahsil()).isEqualTo(UPDATED_GIDER_PUSULA_MUSTAHSIL);
        assertThat(testUrunFiyatHesap.getDukkanGider()).isEqualTo(UPDATED_DUKKAN_GIDER);
        assertThat(testUrunFiyatHesap.getKooperatifCalisma()).isEqualTo(UPDATED_KOOPERATIF_CALISMA);
        assertThat(testUrunFiyatHesap.getDayanisma()).isEqualTo(UPDATED_DAYANISMA);
        assertThat(testUrunFiyatHesap.getFire()).isEqualTo(UPDATED_FIRE);
    }

    @Test
    @Transactional
    public void updateNonExistingUrunFiyatHesap() throws Exception {
        int databaseSizeBeforeUpdate = urunFiyatHesapRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUrunFiyatHesapMockMvc
            .perform(
                put("/api/urun-fiyat-hesaps")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(urunFiyatHesap))
            )
            .andExpect(status().isBadRequest());

        // Validate the UrunFiyatHesap in the database
        List<UrunFiyatHesap> urunFiyatHesapList = urunFiyatHesapRepository.findAll();
        assertThat(urunFiyatHesapList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteUrunFiyatHesap() throws Exception {
        // Initialize the database
        urunFiyatHesapRepository.saveAndFlush(urunFiyatHesap);

        int databaseSizeBeforeDelete = urunFiyatHesapRepository.findAll().size();

        // Delete the urunFiyatHesap
        restUrunFiyatHesapMockMvc
            .perform(delete("/api/urun-fiyat-hesaps/{id}", urunFiyatHesap.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UrunFiyatHesap> urunFiyatHesapList = urunFiyatHesapRepository.findAll();
        assertThat(urunFiyatHesapList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
