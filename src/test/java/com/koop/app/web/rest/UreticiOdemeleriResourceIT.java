package com.koop.app.web.rest;

import com.koop.app.KoopApp;
import com.koop.app.domain.UreticiOdemeleri;
import com.koop.app.repository.UreticiOdemeleriRepository;
import com.koop.app.service.UreticiOdemeleriService;

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

/**
 * Integration tests for the {@link UreticiOdemeleriResource} REST controller.
 */
@SpringBootTest(classes = KoopApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class UreticiOdemeleriResourceIT {

    private static final BigDecimal DEFAULT_TUTAR = new BigDecimal(1);
    private static final BigDecimal UPDATED_TUTAR = new BigDecimal(2);

    private static final ZonedDateTime DEFAULT_SON_GUNCELLENME_TARIHI = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_SON_GUNCELLENME_TARIHI = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private UreticiOdemeleriRepository ureticiOdemeleriRepository;

    @Autowired
    private UreticiOdemeleriService ureticiOdemeleriService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUreticiOdemeleriMockMvc;

    private UreticiOdemeleri ureticiOdemeleri;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UreticiOdemeleri createEntity(EntityManager em) {
        UreticiOdemeleri ureticiOdemeleri = new UreticiOdemeleri()
            .tutar(DEFAULT_TUTAR)
            .sonGuncellenmeTarihi(DEFAULT_SON_GUNCELLENME_TARIHI);
        return ureticiOdemeleri;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UreticiOdemeleri createUpdatedEntity(EntityManager em) {
        UreticiOdemeleri ureticiOdemeleri = new UreticiOdemeleri()
            .tutar(UPDATED_TUTAR)
            .sonGuncellenmeTarihi(UPDATED_SON_GUNCELLENME_TARIHI);
        return ureticiOdemeleri;
    }

    @BeforeEach
    public void initTest() {
        ureticiOdemeleri = createEntity(em);
    }

    @Test
    @Transactional
    public void createUreticiOdemeleri() throws Exception {
        int databaseSizeBeforeCreate = ureticiOdemeleriRepository.findAll().size();
        // Create the UreticiOdemeleri
        restUreticiOdemeleriMockMvc.perform(post("/api/uretici-odemeleris")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(ureticiOdemeleri)))
            .andExpect(status().isCreated());

        // Validate the UreticiOdemeleri in the database
        List<UreticiOdemeleri> ureticiOdemeleriList = ureticiOdemeleriRepository.findAll();
        assertThat(ureticiOdemeleriList).hasSize(databaseSizeBeforeCreate + 1);
        UreticiOdemeleri testUreticiOdemeleri = ureticiOdemeleriList.get(ureticiOdemeleriList.size() - 1);
        assertThat(testUreticiOdemeleri.getTutar()).isEqualTo(DEFAULT_TUTAR);
        assertThat(testUreticiOdemeleri.getSonGuncellenmeTarihi()).isEqualTo(DEFAULT_SON_GUNCELLENME_TARIHI);
    }

    @Test
    @Transactional
    public void createUreticiOdemeleriWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = ureticiOdemeleriRepository.findAll().size();

        // Create the UreticiOdemeleri with an existing ID
        ureticiOdemeleri.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restUreticiOdemeleriMockMvc.perform(post("/api/uretici-odemeleris")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(ureticiOdemeleri)))
            .andExpect(status().isBadRequest());

        // Validate the UreticiOdemeleri in the database
        List<UreticiOdemeleri> ureticiOdemeleriList = ureticiOdemeleriRepository.findAll();
        assertThat(ureticiOdemeleriList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllUreticiOdemeleris() throws Exception {
        // Initialize the database
        ureticiOdemeleriRepository.saveAndFlush(ureticiOdemeleri);

        // Get all the ureticiOdemeleriList
        restUreticiOdemeleriMockMvc.perform(get("/api/uretici-odemeleris?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ureticiOdemeleri.getId().intValue())))
            .andExpect(jsonPath("$.[*].tutar").value(hasItem(DEFAULT_TUTAR.intValue())))
            .andExpect(jsonPath("$.[*].sonGuncellenmeTarihi").value(hasItem(sameInstant(DEFAULT_SON_GUNCELLENME_TARIHI))));
    }
    
    @Test
    @Transactional
    public void getUreticiOdemeleri() throws Exception {
        // Initialize the database
        ureticiOdemeleriRepository.saveAndFlush(ureticiOdemeleri);

        // Get the ureticiOdemeleri
        restUreticiOdemeleriMockMvc.perform(get("/api/uretici-odemeleris/{id}", ureticiOdemeleri.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(ureticiOdemeleri.getId().intValue()))
            .andExpect(jsonPath("$.tutar").value(DEFAULT_TUTAR.intValue()))
            .andExpect(jsonPath("$.sonGuncellenmeTarihi").value(sameInstant(DEFAULT_SON_GUNCELLENME_TARIHI)));
    }
    @Test
    @Transactional
    public void getNonExistingUreticiOdemeleri() throws Exception {
        // Get the ureticiOdemeleri
        restUreticiOdemeleriMockMvc.perform(get("/api/uretici-odemeleris/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateUreticiOdemeleri() throws Exception {
        // Initialize the database
        ureticiOdemeleriService.save(ureticiOdemeleri);

        int databaseSizeBeforeUpdate = ureticiOdemeleriRepository.findAll().size();

        // Update the ureticiOdemeleri
        UreticiOdemeleri updatedUreticiOdemeleri = ureticiOdemeleriRepository.findById(ureticiOdemeleri.getId()).get();
        // Disconnect from session so that the updates on updatedUreticiOdemeleri are not directly saved in db
        em.detach(updatedUreticiOdemeleri);
        updatedUreticiOdemeleri
            .tutar(UPDATED_TUTAR)
            .sonGuncellenmeTarihi(UPDATED_SON_GUNCELLENME_TARIHI);

        restUreticiOdemeleriMockMvc.perform(put("/api/uretici-odemeleris")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedUreticiOdemeleri)))
            .andExpect(status().isOk());

        // Validate the UreticiOdemeleri in the database
        List<UreticiOdemeleri> ureticiOdemeleriList = ureticiOdemeleriRepository.findAll();
        assertThat(ureticiOdemeleriList).hasSize(databaseSizeBeforeUpdate);
        UreticiOdemeleri testUreticiOdemeleri = ureticiOdemeleriList.get(ureticiOdemeleriList.size() - 1);
        assertThat(testUreticiOdemeleri.getTutar()).isEqualTo(UPDATED_TUTAR);
        assertThat(testUreticiOdemeleri.getSonGuncellenmeTarihi()).isEqualTo(UPDATED_SON_GUNCELLENME_TARIHI);
    }

    @Test
    @Transactional
    public void updateNonExistingUreticiOdemeleri() throws Exception {
        int databaseSizeBeforeUpdate = ureticiOdemeleriRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUreticiOdemeleriMockMvc.perform(put("/api/uretici-odemeleris")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(ureticiOdemeleri)))
            .andExpect(status().isBadRequest());

        // Validate the UreticiOdemeleri in the database
        List<UreticiOdemeleri> ureticiOdemeleriList = ureticiOdemeleriRepository.findAll();
        assertThat(ureticiOdemeleriList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteUreticiOdemeleri() throws Exception {
        // Initialize the database
        ureticiOdemeleriService.save(ureticiOdemeleri);

        int databaseSizeBeforeDelete = ureticiOdemeleriRepository.findAll().size();

        // Delete the ureticiOdemeleri
        restUreticiOdemeleriMockMvc.perform(delete("/api/uretici-odemeleris/{id}", ureticiOdemeleri.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UreticiOdemeleri> ureticiOdemeleriList = ureticiOdemeleriRepository.findAll();
        assertThat(ureticiOdemeleriList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
