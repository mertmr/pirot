package com.koop.app.web.rest;

import com.koop.app.KoopApp;
import com.koop.app.domain.Uretici;
import com.koop.app.repository.UreticiRepository;
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
import org.springframework.security.test.context.support.WithMockUser;
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

/**
 * Integration tests for the {@link UreticiResource} REST controller.
 */
@SpringBootTest(classes = KoopApp.class)
public class UreticiResourceIT {

    private static final String DEFAULT_ADI = "AAAAAAAAAA";
    private static final String UPDATED_ADI = "BBBBBBBBBB";

    private static final String DEFAULT_ADRES = "AAAAAAAAAA";
    private static final String UPDATED_ADRES = "BBBBBBBBBB";

    private static final String DEFAULT_BANKA_BILGILERI = "AAAAAAAAAA";
    private static final String UPDATED_BANKA_BILGILERI = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_TARIH = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TARIH = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private UreticiRepository ureticiRepository;

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

    private MockMvc restUreticiMockMvc;

    private Uretici uretici;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final UreticiResource ureticiResource = new UreticiResource(ureticiRepository, userService);
        this.restUreticiMockMvc = MockMvcBuilders.standaloneSetup(ureticiResource)
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
    public static Uretici createEntity(EntityManager em) {
        Uretici uretici = new Uretici()
            .adi(DEFAULT_ADI)
            .adres(DEFAULT_ADRES)
            .bankaBilgileri(DEFAULT_BANKA_BILGILERI)
            .tarih(DEFAULT_TARIH);
        return uretici;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Uretici createUpdatedEntity(EntityManager em) {
        Uretici uretici = new Uretici()
            .adi(UPDATED_ADI)
            .adres(UPDATED_ADRES)
            .bankaBilgileri(UPDATED_BANKA_BILGILERI)
            .tarih(UPDATED_TARIH);
        return uretici;
    }

    @BeforeEach
    public void initTest() {
        uretici = createEntity(em);
    }

    @Test
    @Transactional
    @WithMockUser(value = "admin")
    public void createUretici() throws Exception {
        int databaseSizeBeforeCreate = ureticiRepository.findAll().size();

        // Create the Uretici
        restUreticiMockMvc.perform(post("/api/ureticis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(uretici)))
            .andExpect(status().isCreated());

        // Validate the Uretici in the database
        List<Uretici> ureticiList = ureticiRepository.findAll();
        assertThat(ureticiList).hasSize(databaseSizeBeforeCreate + 1);
        Uretici testUretici = ureticiList.get(ureticiList.size() - 1);
        assertThat(testUretici.getAdi()).isEqualTo(DEFAULT_ADI);
        assertThat(testUretici.getAdres()).isEqualTo(DEFAULT_ADRES);
        assertThat(testUretici.getBankaBilgileri()).isEqualTo(DEFAULT_BANKA_BILGILERI);
        assertThat(testUretici.getTarih()).isEqualTo(DEFAULT_TARIH);
    }

    @Test
    @Transactional
    public void createUreticiWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = ureticiRepository.findAll().size();

        // Create the Uretici with an existing ID
        uretici.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restUreticiMockMvc.perform(post("/api/ureticis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(uretici)))
            .andExpect(status().isBadRequest());

        // Validate the Uretici in the database
        List<Uretici> ureticiList = ureticiRepository.findAll();
        assertThat(ureticiList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkAdiIsRequired() throws Exception {
        int databaseSizeBeforeTest = ureticiRepository.findAll().size();
        // set the field null
        uretici.setAdi(null);

        // Create the Uretici, which fails.

        restUreticiMockMvc.perform(post("/api/ureticis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(uretici)))
            .andExpect(status().isBadRequest());

        List<Uretici> ureticiList = ureticiRepository.findAll();
        assertThat(ureticiList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkBankaBilgileriIsRequired() throws Exception {
        int databaseSizeBeforeTest = ureticiRepository.findAll().size();
        // set the field null
        uretici.setBankaBilgileri(null);

        // Create the Uretici, which fails.

        restUreticiMockMvc.perform(post("/api/ureticis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(uretici)))
            .andExpect(status().isBadRequest());

        List<Uretici> ureticiList = ureticiRepository.findAll();
        assertThat(ureticiList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllUreticis() throws Exception {
        // Initialize the database
        ureticiRepository.saveAndFlush(uretici);

        // Get all the ureticiList
        restUreticiMockMvc.perform(get("/api/ureticis?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(uretici.getId().intValue())))
            .andExpect(jsonPath("$.[*].adi").value(hasItem(DEFAULT_ADI)))
            .andExpect(jsonPath("$.[*].adres").value(hasItem(DEFAULT_ADRES)))
            .andExpect(jsonPath("$.[*].bankaBilgileri").value(hasItem(DEFAULT_BANKA_BILGILERI)))
            .andExpect(jsonPath("$.[*].tarih").value(hasItem(sameInstant(DEFAULT_TARIH))));
    }

    @Test
    @Transactional
    public void getUretici() throws Exception {
        // Initialize the database
        ureticiRepository.saveAndFlush(uretici);

        // Get the uretici
        restUreticiMockMvc.perform(get("/api/ureticis/{id}", uretici.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(uretici.getId().intValue()))
            .andExpect(jsonPath("$.adi").value(DEFAULT_ADI))
            .andExpect(jsonPath("$.adres").value(DEFAULT_ADRES))
            .andExpect(jsonPath("$.bankaBilgileri").value(DEFAULT_BANKA_BILGILERI))
            .andExpect(jsonPath("$.tarih").value(sameInstant(DEFAULT_TARIH)));
    }

    @Test
    @Transactional
    public void getNonExistingUretici() throws Exception {
        // Get the uretici
        restUreticiMockMvc.perform(get("/api/ureticis/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    @WithMockUser(value = "admin")
    public void updateUretici() throws Exception {
        // Initialize the database
        ureticiRepository.saveAndFlush(uretici);

        int databaseSizeBeforeUpdate = ureticiRepository.findAll().size();

        // Update the uretici
        Uretici updatedUretici = ureticiRepository.findById(uretici.getId()).get();
        // Disconnect from session so that the updates on updatedUretici are not directly saved in db
        em.detach(updatedUretici);
        updatedUretici
            .adi(UPDATED_ADI)
            .adres(UPDATED_ADRES)
            .bankaBilgileri(UPDATED_BANKA_BILGILERI)
            .tarih(UPDATED_TARIH);

        restUreticiMockMvc.perform(put("/api/ureticis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedUretici)))
            .andExpect(status().isOk());

        // Validate the Uretici in the database
        List<Uretici> ureticiList = ureticiRepository.findAll();
        assertThat(ureticiList).hasSize(databaseSizeBeforeUpdate);
        Uretici testUretici = ureticiList.get(ureticiList.size() - 1);
        assertThat(testUretici.getAdi()).isEqualTo(UPDATED_ADI);
        assertThat(testUretici.getAdres()).isEqualTo(UPDATED_ADRES);
        assertThat(testUretici.getBankaBilgileri()).isEqualTo(UPDATED_BANKA_BILGILERI);
        assertThat(testUretici.getTarih()).isEqualTo(UPDATED_TARIH);
    }

    @Test
    @Transactional
    public void updateNonExistingUretici() throws Exception {
        int databaseSizeBeforeUpdate = ureticiRepository.findAll().size();

        // Create the Uretici

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUreticiMockMvc.perform(put("/api/ureticis")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(uretici)))
            .andExpect(status().isBadRequest());

        // Validate the Uretici in the database
        List<Uretici> ureticiList = ureticiRepository.findAll();
        assertThat(ureticiList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteUretici() throws Exception {
        // Initialize the database
        ureticiRepository.saveAndFlush(uretici);

        int databaseSizeBeforeDelete = ureticiRepository.findAll().size();

        // Delete the uretici
        restUreticiMockMvc.perform(delete("/api/ureticis/{id}", uretici.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Uretici> ureticiList = ureticiRepository.findAll();
        assertThat(ureticiList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
