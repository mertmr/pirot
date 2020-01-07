package com.koop.app.web.rest;

import com.koop.app.KoopApp;
import com.koop.app.domain.StokGirisi;
import com.koop.app.repository.StokGirisiRepository;
import com.koop.app.service.UserService;
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

import com.koop.app.domain.enumeration.StokHareketiTipi;
/**
 * Integration tests for the {@link StokGirisiResource} REST controller.
 */
@SpringBootTest(classes = KoopApp.class)
public class StokGirisiResourceIT {

    private static final Integer DEFAULT_MIKTAR = 1;
    private static final Integer UPDATED_MIKTAR = 2;

    private static final Integer DEFAULT_AGIRLIK = 1;
    private static final Integer UPDATED_AGIRLIK = 2;

    private static final String DEFAULT_NOTLAR = "AAAAAAAAAA";
    private static final String UPDATED_NOTLAR = "BBBBBBBBBB";

    private static final StokHareketiTipi DEFAULT_STOK_HAREKETI_TIPI = StokHareketiTipi.YOK;
    private static final StokHareketiTipi UPDATED_STOK_HAREKETI_TIPI = StokHareketiTipi.STOK_GIRISI;

    private static final ZonedDateTime DEFAULT_TARIH = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TARIH = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private StokGirisiRepository stokGirisiRepository;

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

    @Autowired
    private UserService userService;

    private MockMvc restStokGirisiMockMvc;

    private StokGirisi stokGirisi;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final StokGirisiResource stokGirisiResource = new StokGirisiResource(stokGirisiRepository, userService);
        this.restStokGirisiMockMvc = MockMvcBuilders.standaloneSetup(stokGirisiResource)
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
    public static StokGirisi createEntity(EntityManager em) {
        StokGirisi stokGirisi = new StokGirisi()
            .miktar(DEFAULT_MIKTAR)
            .agirlik(DEFAULT_AGIRLIK)
            .notlar(DEFAULT_NOTLAR)
            .stokHareketiTipi(DEFAULT_STOK_HAREKETI_TIPI)
            .tarih(DEFAULT_TARIH);
        return stokGirisi;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static StokGirisi createUpdatedEntity(EntityManager em) {
        StokGirisi stokGirisi = new StokGirisi()
            .miktar(UPDATED_MIKTAR)
            .agirlik(UPDATED_AGIRLIK)
            .notlar(UPDATED_NOTLAR)
            .stokHareketiTipi(UPDATED_STOK_HAREKETI_TIPI)
            .tarih(UPDATED_TARIH);
        return stokGirisi;
    }

    @BeforeEach
    public void initTest() {
        stokGirisi = createEntity(em);
    }

    @Test
    @Transactional
    public void createStokGirisi() throws Exception {
        int databaseSizeBeforeCreate = stokGirisiRepository.findAll().size();

        // Create the StokGirisi
        restStokGirisiMockMvc.perform(post("/api/stok-girisis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(stokGirisi)))
            .andExpect(status().isCreated());

        // Validate the StokGirisi in the database
        List<StokGirisi> stokGirisiList = stokGirisiRepository.findAll();
        assertThat(stokGirisiList).hasSize(databaseSizeBeforeCreate + 1);
        StokGirisi testStokGirisi = stokGirisiList.get(stokGirisiList.size() - 1);
        assertThat(testStokGirisi.getMiktar()).isEqualTo(DEFAULT_MIKTAR);
        assertThat(testStokGirisi.getAgirlik()).isEqualTo(DEFAULT_AGIRLIK);
        assertThat(testStokGirisi.getNotlar()).isEqualTo(DEFAULT_NOTLAR);
        assertThat(testStokGirisi.getStokHareketiTipi()).isEqualTo(DEFAULT_STOK_HAREKETI_TIPI);
        assertThat(testStokGirisi.getTarih()).isEqualTo(DEFAULT_TARIH);
    }

    @Test
    @Transactional
    public void createStokGirisiWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = stokGirisiRepository.findAll().size();

        // Create the StokGirisi with an existing ID
        stokGirisi.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restStokGirisiMockMvc.perform(post("/api/stok-girisis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(stokGirisi)))
            .andExpect(status().isBadRequest());

        // Validate the StokGirisi in the database
        List<StokGirisi> stokGirisiList = stokGirisiRepository.findAll();
        assertThat(stokGirisiList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkMiktarIsRequired() throws Exception {
        int databaseSizeBeforeTest = stokGirisiRepository.findAll().size();
        // set the field null
        stokGirisi.setMiktar(null);

        // Create the StokGirisi, which fails.

        restStokGirisiMockMvc.perform(post("/api/stok-girisis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(stokGirisi)))
            .andExpect(status().isBadRequest());

        List<StokGirisi> stokGirisiList = stokGirisiRepository.findAll();
        assertThat(stokGirisiList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkNotlarIsRequired() throws Exception {
        int databaseSizeBeforeTest = stokGirisiRepository.findAll().size();
        // set the field null
        stokGirisi.setNotlar(null);

        // Create the StokGirisi, which fails.

        restStokGirisiMockMvc.perform(post("/api/stok-girisis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(stokGirisi)))
            .andExpect(status().isBadRequest());

        List<StokGirisi> stokGirisiList = stokGirisiRepository.findAll();
        assertThat(stokGirisiList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkStokHareketiTipiIsRequired() throws Exception {
        int databaseSizeBeforeTest = stokGirisiRepository.findAll().size();
        // set the field null
        stokGirisi.setStokHareketiTipi(null);

        // Create the StokGirisi, which fails.

        restStokGirisiMockMvc.perform(post("/api/stok-girisis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(stokGirisi)))
            .andExpect(status().isBadRequest());

        List<StokGirisi> stokGirisiList = stokGirisiRepository.findAll();
        assertThat(stokGirisiList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllStokGirisis() throws Exception {
        // Initialize the database
        stokGirisiRepository.saveAndFlush(stokGirisi);

        // Get all the stokGirisiList
        restStokGirisiMockMvc.perform(get("/api/stok-girisis?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(stokGirisi.getId().intValue())))
            .andExpect(jsonPath("$.[*].miktar").value(hasItem(DEFAULT_MIKTAR)))
            .andExpect(jsonPath("$.[*].agirlik").value(hasItem(DEFAULT_AGIRLIK)))
            .andExpect(jsonPath("$.[*].notlar").value(hasItem(DEFAULT_NOTLAR)))
            .andExpect(jsonPath("$.[*].stokHareketiTipi").value(hasItem(DEFAULT_STOK_HAREKETI_TIPI.toString())))
            .andExpect(jsonPath("$.[*].tarih").value(hasItem(sameInstant(DEFAULT_TARIH))));
    }

    @Test
    @Transactional
    public void getStokGirisi() throws Exception {
        // Initialize the database
        stokGirisiRepository.saveAndFlush(stokGirisi);

        // Get the stokGirisi
        restStokGirisiMockMvc.perform(get("/api/stok-girisis/{id}", stokGirisi.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(stokGirisi.getId().intValue()))
            .andExpect(jsonPath("$.miktar").value(DEFAULT_MIKTAR))
            .andExpect(jsonPath("$.agirlik").value(DEFAULT_AGIRLIK))
            .andExpect(jsonPath("$.notlar").value(DEFAULT_NOTLAR))
            .andExpect(jsonPath("$.stokHareketiTipi").value(DEFAULT_STOK_HAREKETI_TIPI.toString()))
            .andExpect(jsonPath("$.tarih").value(sameInstant(DEFAULT_TARIH)));
    }

    @Test
    @Transactional
    public void getNonExistingStokGirisi() throws Exception {
        // Get the stokGirisi
        restStokGirisiMockMvc.perform(get("/api/stok-girisis/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateStokGirisi() throws Exception {
        // Initialize the database
        stokGirisiRepository.saveAndFlush(stokGirisi);

        int databaseSizeBeforeUpdate = stokGirisiRepository.findAll().size();

        // Update the stokGirisi
        StokGirisi updatedStokGirisi = stokGirisiRepository.findById(stokGirisi.getId()).get();
        // Disconnect from session so that the updates on updatedStokGirisi are not directly saved in db
        em.detach(updatedStokGirisi);
        updatedStokGirisi
            .miktar(UPDATED_MIKTAR)
            .agirlik(UPDATED_AGIRLIK)
            .notlar(UPDATED_NOTLAR)
            .stokHareketiTipi(UPDATED_STOK_HAREKETI_TIPI)
            .tarih(UPDATED_TARIH);

        restStokGirisiMockMvc.perform(put("/api/stok-girisis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedStokGirisi)))
            .andExpect(status().isOk());

        // Validate the StokGirisi in the database
        List<StokGirisi> stokGirisiList = stokGirisiRepository.findAll();
        assertThat(stokGirisiList).hasSize(databaseSizeBeforeUpdate);
        StokGirisi testStokGirisi = stokGirisiList.get(stokGirisiList.size() - 1);
        assertThat(testStokGirisi.getMiktar()).isEqualTo(UPDATED_MIKTAR);
        assertThat(testStokGirisi.getAgirlik()).isEqualTo(UPDATED_AGIRLIK);
        assertThat(testStokGirisi.getNotlar()).isEqualTo(UPDATED_NOTLAR);
        assertThat(testStokGirisi.getStokHareketiTipi()).isEqualTo(UPDATED_STOK_HAREKETI_TIPI);
        assertThat(testStokGirisi.getTarih()).isEqualTo(UPDATED_TARIH);
    }

    @Test
    @Transactional
    public void updateNonExistingStokGirisi() throws Exception {
        int databaseSizeBeforeUpdate = stokGirisiRepository.findAll().size();

        // Create the StokGirisi

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStokGirisiMockMvc.perform(put("/api/stok-girisis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(stokGirisi)))
            .andExpect(status().isBadRequest());

        // Validate the StokGirisi in the database
        List<StokGirisi> stokGirisiList = stokGirisiRepository.findAll();
        assertThat(stokGirisiList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteStokGirisi() throws Exception {
        // Initialize the database
        stokGirisiRepository.saveAndFlush(stokGirisi);

        int databaseSizeBeforeDelete = stokGirisiRepository.findAll().size();

        // Delete the stokGirisi
        restStokGirisiMockMvc.perform(delete("/api/stok-girisis/{id}", stokGirisi.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<StokGirisi> stokGirisiList = stokGirisiRepository.findAll();
        assertThat(stokGirisiList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
