package com.koop.app.web.rest;

import com.koop.app.KoopApp;
import com.koop.app.domain.KdvKategorisi;
import com.koop.app.repository.KdvKategorisiRepository;
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
import java.util.List;

import static com.koop.app.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link KdvKategorisiResource} REST controller.
 */
@SpringBootTest(classes = KoopApp.class)
public class KdvKategorisiResourceIT {

    private static final String DEFAULT_KATEGORI_ADI = "AAAAAAAAAA";
    private static final String UPDATED_KATEGORI_ADI = "BBBBBBBBBB";

    private static final Integer DEFAULT_KDV_ORANI = 1;
    private static final Integer UPDATED_KDV_ORANI = 2;

    @Autowired
    private KdvKategorisiRepository kdvKategorisiRepository;

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

    private MockMvc restKdvKategorisiMockMvc;

    private KdvKategorisi kdvKategorisi;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final KdvKategorisiResource kdvKategorisiResource = new KdvKategorisiResource(kdvKategorisiRepository);
        this.restKdvKategorisiMockMvc = MockMvcBuilders.standaloneSetup(kdvKategorisiResource)
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
    public static KdvKategorisi createEntity(EntityManager em) {
        KdvKategorisi kdvKategorisi = new KdvKategorisi()
            .kategoriAdi(DEFAULT_KATEGORI_ADI)
            .kdvOrani(DEFAULT_KDV_ORANI);
        return kdvKategorisi;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static KdvKategorisi createUpdatedEntity(EntityManager em) {
        KdvKategorisi kdvKategorisi = new KdvKategorisi()
            .kategoriAdi(UPDATED_KATEGORI_ADI)
            .kdvOrani(UPDATED_KDV_ORANI);
        return kdvKategorisi;
    }

    @BeforeEach
    public void initTest() {
        kdvKategorisi = createEntity(em);
    }

    @Test
    @Transactional
    public void createKdvKategorisi() throws Exception {
        int databaseSizeBeforeCreate = kdvKategorisiRepository.findAll().size();

        // Create the KdvKategorisi
        restKdvKategorisiMockMvc.perform(post("/api/kdv-kategorisis")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(kdvKategorisi)))
            .andExpect(status().isCreated());

        // Validate the KdvKategorisi in the database
        List<KdvKategorisi> kdvKategorisiList = kdvKategorisiRepository.findAll();
        assertThat(kdvKategorisiList).hasSize(databaseSizeBeforeCreate + 1);
        KdvKategorisi testKdvKategorisi = kdvKategorisiList.get(kdvKategorisiList.size() - 1);
        assertThat(testKdvKategorisi.getKategoriAdi()).isEqualTo(DEFAULT_KATEGORI_ADI);
        assertThat(testKdvKategorisi.getKdvOrani()).isEqualTo(DEFAULT_KDV_ORANI);
    }

    @Test
    @Transactional
    public void createKdvKategorisiWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = kdvKategorisiRepository.findAll().size();

        // Create the KdvKategorisi with an existing ID
        kdvKategorisi.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restKdvKategorisiMockMvc.perform(post("/api/kdv-kategorisis")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(kdvKategorisi)))
            .andExpect(status().isBadRequest());

        // Validate the KdvKategorisi in the database
        List<KdvKategorisi> kdvKategorisiList = kdvKategorisiRepository.findAll();
        assertThat(kdvKategorisiList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkKategoriAdiIsRequired() throws Exception {
        int databaseSizeBeforeTest = kdvKategorisiRepository.findAll().size();
        // set the field null
        kdvKategorisi.setKategoriAdi(null);

        // Create the KdvKategorisi, which fails.

        restKdvKategorisiMockMvc.perform(post("/api/kdv-kategorisis")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(kdvKategorisi)))
            .andExpect(status().isBadRequest());

        List<KdvKategorisi> kdvKategorisiList = kdvKategorisiRepository.findAll();
        assertThat(kdvKategorisiList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkKdvOraniIsRequired() throws Exception {
        int databaseSizeBeforeTest = kdvKategorisiRepository.findAll().size();
        // set the field null
        kdvKategorisi.setKdvOrani(null);

        // Create the KdvKategorisi, which fails.

        restKdvKategorisiMockMvc.perform(post("/api/kdv-kategorisis")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(kdvKategorisi)))
            .andExpect(status().isBadRequest());

        List<KdvKategorisi> kdvKategorisiList = kdvKategorisiRepository.findAll();
        assertThat(kdvKategorisiList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllKdvKategorisis() throws Exception {
        // Initialize the database
        kdvKategorisiRepository.saveAndFlush(kdvKategorisi);

        // Get all the kdvKategorisiList
        restKdvKategorisiMockMvc.perform(get("/api/kdv-kategorisis?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(kdvKategorisi.getId().intValue())))
            .andExpect(jsonPath("$.[*].kategoriAdi").value(hasItem(DEFAULT_KATEGORI_ADI)))
            .andExpect(jsonPath("$.[*].kdvOrani").value(hasItem(DEFAULT_KDV_ORANI)));
    }
    
    @Test
    @Transactional
    public void getKdvKategorisi() throws Exception {
        // Initialize the database
        kdvKategorisiRepository.saveAndFlush(kdvKategorisi);

        // Get the kdvKategorisi
        restKdvKategorisiMockMvc.perform(get("/api/kdv-kategorisis/{id}", kdvKategorisi.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(kdvKategorisi.getId().intValue()))
            .andExpect(jsonPath("$.kategoriAdi").value(DEFAULT_KATEGORI_ADI))
            .andExpect(jsonPath("$.kdvOrani").value(DEFAULT_KDV_ORANI));
    }

    @Test
    @Transactional
    public void getNonExistingKdvKategorisi() throws Exception {
        // Get the kdvKategorisi
        restKdvKategorisiMockMvc.perform(get("/api/kdv-kategorisis/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateKdvKategorisi() throws Exception {
        // Initialize the database
        kdvKategorisiRepository.saveAndFlush(kdvKategorisi);

        int databaseSizeBeforeUpdate = kdvKategorisiRepository.findAll().size();

        // Update the kdvKategorisi
        KdvKategorisi updatedKdvKategorisi = kdvKategorisiRepository.findById(kdvKategorisi.getId()).get();
        // Disconnect from session so that the updates on updatedKdvKategorisi are not directly saved in db
        em.detach(updatedKdvKategorisi);
        updatedKdvKategorisi
            .kategoriAdi(UPDATED_KATEGORI_ADI)
            .kdvOrani(UPDATED_KDV_ORANI);

        restKdvKategorisiMockMvc.perform(put("/api/kdv-kategorisis")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedKdvKategorisi)))
            .andExpect(status().isOk());

        // Validate the KdvKategorisi in the database
        List<KdvKategorisi> kdvKategorisiList = kdvKategorisiRepository.findAll();
        assertThat(kdvKategorisiList).hasSize(databaseSizeBeforeUpdate);
        KdvKategorisi testKdvKategorisi = kdvKategorisiList.get(kdvKategorisiList.size() - 1);
        assertThat(testKdvKategorisi.getKategoriAdi()).isEqualTo(UPDATED_KATEGORI_ADI);
        assertThat(testKdvKategorisi.getKdvOrani()).isEqualTo(UPDATED_KDV_ORANI);
    }

    @Test
    @Transactional
    public void updateNonExistingKdvKategorisi() throws Exception {
        int databaseSizeBeforeUpdate = kdvKategorisiRepository.findAll().size();

        // Create the KdvKategorisi

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restKdvKategorisiMockMvc.perform(put("/api/kdv-kategorisis")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(kdvKategorisi)))
            .andExpect(status().isBadRequest());

        // Validate the KdvKategorisi in the database
        List<KdvKategorisi> kdvKategorisiList = kdvKategorisiRepository.findAll();
        assertThat(kdvKategorisiList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteKdvKategorisi() throws Exception {
        // Initialize the database
        kdvKategorisiRepository.saveAndFlush(kdvKategorisi);

        int databaseSizeBeforeDelete = kdvKategorisiRepository.findAll().size();

        // Delete the kdvKategorisi
        restKdvKategorisiMockMvc.perform(delete("/api/kdv-kategorisis/{id}", kdvKategorisi.getId())
            .accept(TestUtil.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<KdvKategorisi> kdvKategorisiList = kdvKategorisiRepository.findAll();
        assertThat(kdvKategorisiList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
