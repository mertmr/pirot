package com.koop.app.web.rest;

import com.koop.app.KoopApp;
import com.koop.app.domain.KasaHareketleri;
import com.koop.app.repository.KasaHareketleriRepository;
import com.koop.app.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;

import static com.koop.app.web.rest.TestUtil.sameInstant;
import static com.koop.app.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link KasaHareketleriResource} REST controller.
 */
@SpringBootTest(classes = KoopApp.class)
public class KasaHareketleriResourceIT {

    private static final BigDecimal DEFAULT_KASA_MIKTAR = new BigDecimal(1);
    private static final BigDecimal UPDATED_KASA_MIKTAR = new BigDecimal(2);

    private static final String DEFAULT_HAREKET = "AAAAAAAAAA";
    private static final String UPDATED_HAREKET = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_TARIH = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TARIH = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private KasaHareketleriRepository kasaHareketleriRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restKasaHareketleriMockMvc;

    private KasaHareketleri kasaHareketleri;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final KasaHareketleriResource kasaHareketleriResource = new KasaHareketleriResource(kasaHareketleriRepository);
        this.restKasaHareketleriMockMvc = MockMvcBuilders.standaloneSetup(kasaHareketleriResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static KasaHareketleri createEntity(EntityManager em) {
        KasaHareketleri kasaHareketleri = new KasaHareketleri()
            .kasaMiktar(DEFAULT_KASA_MIKTAR)
            .hareket(DEFAULT_HAREKET)
            .tarih(DEFAULT_TARIH);
        return kasaHareketleri;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static KasaHareketleri createUpdatedEntity(EntityManager em) {
        KasaHareketleri kasaHareketleri = new KasaHareketleri()
            .kasaMiktar(UPDATED_KASA_MIKTAR)
            .hareket(UPDATED_HAREKET)
            .tarih(UPDATED_TARIH);
        return kasaHareketleri;
    }

    @BeforeEach
    public void initTest() {
        kasaHareketleri = createEntity(em);
    }

    @Test
    @Transactional
    public void createKasaHareketleri() throws Exception {
        int databaseSizeBeforeCreate = kasaHareketleriRepository.findAll().size();

        // Create the KasaHareketleri
        restKasaHareketleriMockMvc.perform(post("/api/kasa-hareketleris")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(kasaHareketleri)))
            .andExpect(status().isCreated());

        // Validate the KasaHareketleri in the database
        List<KasaHareketleri> kasaHareketleriList = kasaHareketleriRepository.findAll();
        assertThat(kasaHareketleriList).hasSize(databaseSizeBeforeCreate + 1);
        KasaHareketleri testKasaHareketleri = kasaHareketleriList.get(kasaHareketleriList.size() - 1);
        assertThat(testKasaHareketleri.getKasaMiktar()).isEqualTo(DEFAULT_KASA_MIKTAR);
        assertThat(testKasaHareketleri.getHareket()).isEqualTo(DEFAULT_HAREKET);
        assertThat(testKasaHareketleri.getTarih()).isEqualTo(DEFAULT_TARIH);
    }

    @Test
    @Transactional
    public void createKasaHareketleriWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = kasaHareketleriRepository.findAll().size();

        // Create the KasaHareketleri with an existing ID
        kasaHareketleri.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restKasaHareketleriMockMvc.perform(post("/api/kasa-hareketleris")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(kasaHareketleri)))
            .andExpect(status().isBadRequest());

        // Validate the KasaHareketleri in the database
        List<KasaHareketleri> kasaHareketleriList = kasaHareketleriRepository.findAll();
        assertThat(kasaHareketleriList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllKasaHareketleris() throws Exception {
        // Initialize the database
        kasaHareketleriRepository.saveAndFlush(kasaHareketleri);

        // Get all the kasaHareketleriList
        restKasaHareketleriMockMvc.perform(get("/api/kasa-hareketleris?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(kasaHareketleri.getId().intValue())))
            .andExpect(jsonPath("$.[*].kasaMiktar").value(hasItem(DEFAULT_KASA_MIKTAR.intValue())))
            .andExpect(jsonPath("$.[*].hareket").value(hasItem(DEFAULT_HAREKET)))
            .andExpect(jsonPath("$.[*].tarih").value(hasItem(sameInstant(DEFAULT_TARIH))));
    }
    
    @Test
    @Transactional
    public void getKasaHareketleri() throws Exception {
        // Initialize the database
        kasaHareketleriRepository.saveAndFlush(kasaHareketleri);

        // Get the kasaHareketleri
        restKasaHareketleriMockMvc.perform(get("/api/kasa-hareketleris/{id}", kasaHareketleri.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(kasaHareketleri.getId().intValue()))
            .andExpect(jsonPath("$.kasaMiktar").value(DEFAULT_KASA_MIKTAR.intValue()))
            .andExpect(jsonPath("$.hareket").value(DEFAULT_HAREKET))
            .andExpect(jsonPath("$.tarih").value(sameInstant(DEFAULT_TARIH)));
    }

    @Test
    @Transactional
    public void getNonExistingKasaHareketleri() throws Exception {
        // Get the kasaHareketleri
        restKasaHareketleriMockMvc.perform(get("/api/kasa-hareketleris/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateKasaHareketleri() throws Exception {
        // Initialize the database
        kasaHareketleriRepository.saveAndFlush(kasaHareketleri);

        int databaseSizeBeforeUpdate = kasaHareketleriRepository.findAll().size();

        // Update the kasaHareketleri
        KasaHareketleri updatedKasaHareketleri = kasaHareketleriRepository.findById(kasaHareketleri.getId()).get();
        // Disconnect from session so that the updates on updatedKasaHareketleri are not directly saved in db
        em.detach(updatedKasaHareketleri);
        updatedKasaHareketleri
            .kasaMiktar(UPDATED_KASA_MIKTAR)
            .hareket(UPDATED_HAREKET)
            .tarih(UPDATED_TARIH);

        restKasaHareketleriMockMvc.perform(put("/api/kasa-hareketleris")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedKasaHareketleri)))
            .andExpect(status().isOk());

        // Validate the KasaHareketleri in the database
        List<KasaHareketleri> kasaHareketleriList = kasaHareketleriRepository.findAll();
        assertThat(kasaHareketleriList).hasSize(databaseSizeBeforeUpdate);
        KasaHareketleri testKasaHareketleri = kasaHareketleriList.get(kasaHareketleriList.size() - 1);
        assertThat(testKasaHareketleri.getKasaMiktar()).isEqualTo(UPDATED_KASA_MIKTAR);
        assertThat(testKasaHareketleri.getHareket()).isEqualTo(UPDATED_HAREKET);
        assertThat(testKasaHareketleri.getTarih()).isEqualTo(UPDATED_TARIH);
    }

    @Test
    @Transactional
    public void updateNonExistingKasaHareketleri() throws Exception {
        int databaseSizeBeforeUpdate = kasaHareketleriRepository.findAll().size();

        // Create the KasaHareketleri

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restKasaHareketleriMockMvc.perform(put("/api/kasa-hareketleris")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(kasaHareketleri)))
            .andExpect(status().isBadRequest());

        // Validate the KasaHareketleri in the database
        List<KasaHareketleri> kasaHareketleriList = kasaHareketleriRepository.findAll();
        assertThat(kasaHareketleriList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteKasaHareketleri() throws Exception {
        // Initialize the database
        kasaHareketleriRepository.saveAndFlush(kasaHareketleri);

        int databaseSizeBeforeDelete = kasaHareketleriRepository.findAll().size();

        // Delete the kasaHareketleri
        restKasaHareketleriMockMvc.perform(delete("/api/kasa-hareketleris/{id}", kasaHareketleri.getId())
            .accept(TestUtil.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<KasaHareketleri> kasaHareketleriList = kasaHareketleriRepository.findAll();
        assertThat(kasaHareketleriList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
