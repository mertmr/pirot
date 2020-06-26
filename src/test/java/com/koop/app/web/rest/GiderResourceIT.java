package com.koop.app.web.rest;

import static com.koop.app.web.rest.TestUtil.createFormattingConversionService;
import static com.koop.app.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.koop.app.KoopApp;
import com.koop.app.domain.Gider;
import com.koop.app.domain.enumeration.GiderTipi;
import com.koop.app.domain.enumeration.OdemeAraci;
import com.koop.app.repository.GiderRepository;
import com.koop.app.service.KasaHareketleriService;
import com.koop.app.service.UserService;
import com.koop.app.web.rest.errors.ExceptionTranslator;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

/**
 * Integration tests for the {@link GiderResource} REST controller.
 */
@SpringBootTest(classes = KoopApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class GiderResourceIT {
    private static final ZonedDateTime DEFAULT_TARIH = ZonedDateTime.ofInstant(
        Instant.ofEpochMilli(0L),
        ZoneOffset.UTC
    );
    private static final ZonedDateTime UPDATED_TARIH = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final BigDecimal DEFAULT_TUTAR = new BigDecimal(1);
    private static final BigDecimal UPDATED_TUTAR = new BigDecimal(2);

    private static final String DEFAULT_NOTLAR = "AAAAAAAAAA";
    private static final String UPDATED_NOTLAR = "BBBBBBBBBB";

    private static final GiderTipi DEFAULT_GIDER_TIPI = GiderTipi.DIGER;
    private static final GiderTipi UPDATED_GIDER_TIPI = GiderTipi.KARGO;

    private static final OdemeAraci DEFAULT_ODEME_ARACI = OdemeAraci.BANKA;
    private static final OdemeAraci UPDATED_ODEME_ARACI = OdemeAraci.NAKIT;

    @Autowired
    private GiderRepository giderRepository;

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

    private MockMvc restGiderMockMvc;

    private Gider gider;

    @Autowired
    private KasaHareketleriService kasaHareketleriService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final GiderResource giderResource = new GiderResource(giderRepository, userService, kasaHareketleriService);
        this.restGiderMockMvc =
            MockMvcBuilders
                .standaloneSetup(giderResource)
                .setCustomArgumentResolvers(pageableArgumentResolver)
                .setControllerAdvice(exceptionTranslator)
                .setConversionService(createFormattingConversionService())
                .setMessageConverters(jacksonMessageConverter)
                .setValidator(validator)
                .build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Gider createEntity(EntityManager em) {
        Gider gider = new Gider()
            .tarih(DEFAULT_TARIH)
            .tutar(DEFAULT_TUTAR)
            .notlar(DEFAULT_NOTLAR)
            .giderTipi(DEFAULT_GIDER_TIPI)
            .odemeAraci(DEFAULT_ODEME_ARACI);
        return gider;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Gider createUpdatedEntity(EntityManager em) {
        Gider gider = new Gider()
            .tarih(UPDATED_TARIH)
            .tutar(UPDATED_TUTAR)
            .notlar(UPDATED_NOTLAR)
            .giderTipi(UPDATED_GIDER_TIPI)
            .odemeAraci(UPDATED_ODEME_ARACI);
        return gider;
    }

    @BeforeEach
    public void initTest() {
        gider = createEntity(em);
    }

    @Test
    @Transactional
    @WithMockUser(value = "admin")
    public void createGider() throws Exception {
        int databaseSizeBeforeCreate = giderRepository.findAll().size();
        // Create the Gider
        restGiderMockMvc
            .perform(
                post("/api/giders")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(gider))
            )
            .andExpect(status().isCreated());

        // Validate the Gider in the database
        List<Gider> giderList = giderRepository.findAll();
        assertThat(giderList).hasSize(databaseSizeBeforeCreate + 1);
        Gider testGider = giderList.get(giderList.size() - 1);
        assertThat(testGider.getTarih()).isEqualTo(DEFAULT_TARIH);
        assertThat(testGider.getTutar()).isEqualTo(DEFAULT_TUTAR);
        assertThat(testGider.getNotlar()).isEqualTo(DEFAULT_NOTLAR);
        assertThat(testGider.getGiderTipi()).isEqualTo(DEFAULT_GIDER_TIPI);
        assertThat(testGider.getOdemeAraci()).isEqualTo(DEFAULT_ODEME_ARACI);
    }

    @Test
    @Transactional
    public void createGiderWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = giderRepository.findAll().size();

        // Create the Gider with an existing ID
        gider.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restGiderMockMvc
            .perform(
                post("/api/giders")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(gider))
            )
            .andExpect(status().isBadRequest());

        // Validate the Gider in the database
        List<Gider> giderList = giderRepository.findAll();
        assertThat(giderList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkTutarIsRequired() throws Exception {
        int databaseSizeBeforeTest = giderRepository.findAll().size();
        // set the field null
        gider.setTutar(null);

        // Create the Gider, which fails.

        restGiderMockMvc
            .perform(
                post("/api/giders")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(gider))
            )
            .andExpect(status().isBadRequest());

        List<Gider> giderList = giderRepository.findAll();
        assertThat(giderList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkNotlarIsRequired() throws Exception {
        int databaseSizeBeforeTest = giderRepository.findAll().size();
        // set the field null
        gider.setNotlar(null);

        // Create the Gider, which fails.

        restGiderMockMvc
            .perform(
                post("/api/giders")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(gider))
            )
            .andExpect(status().isBadRequest());

        List<Gider> giderList = giderRepository.findAll();
        assertThat(giderList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkGiderTipiIsRequired() throws Exception {
        int databaseSizeBeforeTest = giderRepository.findAll().size();
        // set the field null
        gider.setGiderTipi(null);

        // Create the Gider, which fails.

        restGiderMockMvc
            .perform(
                post("/api/giders")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(gider))
            )
            .andExpect(status().isBadRequest());

        List<Gider> giderList = giderRepository.findAll();
        assertThat(giderList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkOdemeAraciIsRequired() throws Exception {
        int databaseSizeBeforeTest = giderRepository.findAll().size();
        // set the field null
        gider.setOdemeAraci(null);

        // Create the Gider, which fails.

        restGiderMockMvc
            .perform(
                post("/api/giders")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(gider))
            )
            .andExpect(status().isBadRequest());

        List<Gider> giderList = giderRepository.findAll();
        assertThat(giderList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllGiders() throws Exception {
        // Initialize the database
        giderRepository.saveAndFlush(gider);

        // Get all the giderList
        restGiderMockMvc
            .perform(get("/api/giders?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(gider.getId().intValue())))
            .andExpect(jsonPath("$.[*].tarih").value(hasItem(sameInstant(DEFAULT_TARIH))))
            .andExpect(jsonPath("$.[*].tutar").value(hasItem(DEFAULT_TUTAR.intValue())))
            .andExpect(jsonPath("$.[*].notlar").value(hasItem(DEFAULT_NOTLAR)))
            .andExpect(jsonPath("$.[*].giderTipi").value(hasItem(DEFAULT_GIDER_TIPI.toString())))
            .andExpect(jsonPath("$.[*].odemeAraci").value(hasItem(DEFAULT_ODEME_ARACI.toString())));
    }

    @Test
    @Transactional
    public void getGider() throws Exception {
        // Initialize the database
        giderRepository.saveAndFlush(gider);

        // Get the gider
        restGiderMockMvc
            .perform(get("/api/giders/{id}", gider.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(gider.getId().intValue()))
            .andExpect(jsonPath("$.tarih").value(sameInstant(DEFAULT_TARIH)))
            .andExpect(jsonPath("$.tutar").value(DEFAULT_TUTAR.intValue()))
            .andExpect(jsonPath("$.notlar").value(DEFAULT_NOTLAR))
            .andExpect(jsonPath("$.giderTipi").value(DEFAULT_GIDER_TIPI.toString()))
            .andExpect(jsonPath("$.odemeAraci").value(DEFAULT_ODEME_ARACI.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingGider() throws Exception {
        // Get the gider
        restGiderMockMvc.perform(get("/api/giders/{id}", Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    @WithMockUser(value = "admin")
    public void updateGider() throws Exception {
        // Initialize the database
        giderRepository.saveAndFlush(gider);

        int databaseSizeBeforeUpdate = giderRepository.findAll().size();

        // Update the gider
        Gider updatedGider = giderRepository.findById(gider.getId()).get();
        // Disconnect from session so that the updates on updatedGider are not directly saved in db
        em.detach(updatedGider);
        updatedGider
            .tarih(UPDATED_TARIH)
            .tutar(UPDATED_TUTAR)
            .notlar(UPDATED_NOTLAR)
            .giderTipi(UPDATED_GIDER_TIPI)
            .odemeAraci(UPDATED_ODEME_ARACI);

        restGiderMockMvc
            .perform(
                put("/api/giders")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedGider))
            )
            .andExpect(status().isOk());

        // Validate the Gider in the database
        List<Gider> giderList = giderRepository.findAll();
        assertThat(giderList).hasSize(databaseSizeBeforeUpdate);
        Gider testGider = giderList.get(giderList.size() - 1);
        assertThat(testGider.getTarih()).isEqualTo(UPDATED_TARIH);
        assertThat(testGider.getTutar()).isEqualTo(UPDATED_TUTAR);
        assertThat(testGider.getNotlar()).isEqualTo(UPDATED_NOTLAR);
        assertThat(testGider.getGiderTipi()).isEqualTo(UPDATED_GIDER_TIPI);
        assertThat(testGider.getOdemeAraci()).isEqualTo(UPDATED_ODEME_ARACI);
    }

    @Test
    @Transactional
    public void updateNonExistingGider() throws Exception {
        int databaseSizeBeforeUpdate = giderRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGiderMockMvc
            .perform(
                put("/api/giders")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(gider))
            )
            .andExpect(status().isBadRequest());

        // Validate the Gider in the database
        List<Gider> giderList = giderRepository.findAll();
        assertThat(giderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteGider() throws Exception {
        // Initialize the database
        giderRepository.saveAndFlush(gider);

        int databaseSizeBeforeDelete = giderRepository.findAll().size();

        // Delete the gider
        restGiderMockMvc
            .perform(delete("/api/giders/{id}", gider.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Gider> giderList = giderRepository.findAll();
        assertThat(giderList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
