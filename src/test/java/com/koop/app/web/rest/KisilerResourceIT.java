package com.koop.app.web.rest;

import static com.koop.app.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.koop.app.KoopApp;
import com.koop.app.domain.Kisiler;
import com.koop.app.repository.KisilerRepository;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
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
 * Integration tests for the {@link KisilerResource} REST controller.
 */
@SpringBootTest(classes = KoopApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class KisilerResourceIT {

    private static final String DEFAULT_KISI_ADI = "AAAAAAAAAA";
    private static final String UPDATED_KISI_ADI = "BBBBBBBBBB";

    private static final String DEFAULT_NOTLAR = "AAAAAAAAAA";
    private static final String UPDATED_NOTLAR = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_TARIH = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TARIH = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Boolean DEFAULT_ACTIVE = true;
    private static final Boolean UPDATED_ACTIVE = false;

    @Autowired
    private KisilerRepository kisilerRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restKisilerMockMvc;

    private Kisiler kisiler;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Kisiler createEntity(EntityManager em) {
        Kisiler kisiler = new Kisiler().kisiAdi(DEFAULT_KISI_ADI).notlar(DEFAULT_NOTLAR).tarih(DEFAULT_TARIH).active(DEFAULT_ACTIVE);
        return kisiler;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Kisiler createUpdatedEntity(EntityManager em) {
        Kisiler kisiler = new Kisiler().kisiAdi(UPDATED_KISI_ADI).notlar(UPDATED_NOTLAR).tarih(UPDATED_TARIH).active(UPDATED_ACTIVE);
        return kisiler;
    }

    @BeforeEach
    public void initTest() {
        kisiler = createEntity(em);
    }

    @Test
    @Transactional
    public void createKisiler() throws Exception {
        int databaseSizeBeforeCreate = kisilerRepository.findAll().size();
        // Create the Kisiler
        restKisilerMockMvc
            .perform(post("/api/kisilers").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(kisiler)))
            .andExpect(status().isCreated());

        // Validate the Kisiler in the database
        List<Kisiler> kisilerList = kisilerRepository.findAll();
        assertThat(kisilerList).hasSize(databaseSizeBeforeCreate + 1);
        Kisiler testKisiler = kisilerList.get(kisilerList.size() - 1);
        assertThat(testKisiler.getKisiAdi()).isEqualTo(DEFAULT_KISI_ADI);
        assertThat(testKisiler.getNotlar()).isEqualTo(DEFAULT_NOTLAR);
        assertThat(testKisiler.getTarih()).isEqualTo(DEFAULT_TARIH);
        assertThat(testKisiler.isActive()).isEqualTo(true);
    }

    @Test
    @Transactional
    public void createKisilerWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = kisilerRepository.findAll().size();

        // Create the Kisiler with an existing ID
        kisiler.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restKisilerMockMvc
            .perform(post("/api/kisilers").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(kisiler)))
            .andExpect(status().isBadRequest());

        // Validate the Kisiler in the database
        List<Kisiler> kisilerList = kisilerRepository.findAll();
        assertThat(kisilerList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllKisilers() throws Exception {
        // Initialize the database
        kisilerRepository.saveAndFlush(kisiler);

        // Get all the kisilerList
        restKisilerMockMvc
            .perform(get("/api/kisilers?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(kisiler.getId().intValue())))
            .andExpect(jsonPath("$.[*].kisiAdi").value(hasItem(DEFAULT_KISI_ADI)))
            .andExpect(jsonPath("$.[*].notlar").value(hasItem(DEFAULT_NOTLAR)))
            .andExpect(jsonPath("$.[*].tarih").value(hasItem(sameInstant(DEFAULT_TARIH))))
            .andExpect(jsonPath("$.[*].active").value(hasItem(DEFAULT_ACTIVE.booleanValue())));
    }

    @Test
    @Transactional
    public void getKisiler() throws Exception {
        // Initialize the database
        kisilerRepository.saveAndFlush(kisiler);

        // Get the kisiler
        restKisilerMockMvc
            .perform(get("/api/kisilers/{id}", kisiler.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(kisiler.getId().intValue()))
            .andExpect(jsonPath("$.kisiAdi").value(DEFAULT_KISI_ADI))
            .andExpect(jsonPath("$.notlar").value(DEFAULT_NOTLAR))
            .andExpect(jsonPath("$.tarih").value(sameInstant(DEFAULT_TARIH)))
            .andExpect(jsonPath("$.active").value(DEFAULT_ACTIVE.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingKisiler() throws Exception {
        // Get the kisiler
        restKisilerMockMvc.perform(get("/api/kisilers/{id}", Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateKisiler() throws Exception {
        // Initialize the database
        kisilerRepository.saveAndFlush(kisiler);

        int databaseSizeBeforeUpdate = kisilerRepository.findAll().size();

        // Update the kisiler
        Kisiler updatedKisiler = kisilerRepository.findById(kisiler.getId()).get();
        // Disconnect from session so that the updates on updatedKisiler are not directly saved in db
        em.detach(updatedKisiler);
        updatedKisiler.kisiAdi(UPDATED_KISI_ADI).notlar(UPDATED_NOTLAR).tarih(UPDATED_TARIH).active(UPDATED_ACTIVE);

        restKisilerMockMvc
            .perform(
                put("/api/kisilers").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(updatedKisiler))
            )
            .andExpect(status().isOk());

        // Validate the Kisiler in the database
        List<Kisiler> kisilerList = kisilerRepository.findAll();
        assertThat(kisilerList).hasSize(databaseSizeBeforeUpdate);
        Kisiler testKisiler = kisilerList.get(kisilerList.size() - 1);
        assertThat(testKisiler.getKisiAdi()).isEqualTo(UPDATED_KISI_ADI);
        assertThat(testKisiler.getNotlar()).isEqualTo(UPDATED_NOTLAR);
        assertThat(testKisiler.getTarih()).isEqualTo(UPDATED_TARIH);
        assertThat(testKisiler.isActive()).isEqualTo(UPDATED_ACTIVE);
    }

    @Test
    @Transactional
    public void updateNonExistingKisiler() throws Exception {
        int databaseSizeBeforeUpdate = kisilerRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restKisilerMockMvc
            .perform(put("/api/kisilers").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(kisiler)))
            .andExpect(status().isBadRequest());

        // Validate the Kisiler in the database
        List<Kisiler> kisilerList = kisilerRepository.findAll();
        assertThat(kisilerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteKisiler() throws Exception {
        // Initialize the database
        kisilerRepository.saveAndFlush(kisiler);

        int databaseSizeBeforeDelete = kisilerRepository.findAll().size();

        // Delete the kisiler
        restKisilerMockMvc
            .perform(delete("/api/kisilers/{id}", kisiler.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Kisiler> kisilerList = kisilerRepository.findAll();
        assertThat(kisilerList).hasSize(databaseSizeBeforeDelete); //kisi sadece deaktif ediliyor, silinmemeli
    }
}
