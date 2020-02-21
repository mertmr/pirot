package com.koop.app.web.rest;

import com.koop.app.KoopApp;
import com.koop.app.domain.UrunFiyat;
import com.koop.app.repository.UrunFiyatRepository;
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
 * Integration tests for the {@link UrunFiyatResource} REST controller.
 */
@SpringBootTest(classes = KoopApp.class)
public class UrunFiyatResourceIT {

    private static final BigDecimal DEFAULT_FIYAT = new BigDecimal(1);
    private static final BigDecimal UPDATED_FIYAT = new BigDecimal(2);

    private static final ZonedDateTime DEFAULT_TARIH = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TARIH = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private UrunFiyatRepository urunFiyatRepository;

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

    private MockMvc restUrunFiyatMockMvc;

    private UrunFiyat urunFiyat;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final UrunFiyatResource urunFiyatResource = new UrunFiyatResource(urunFiyatRepository, userService);
        this.restUrunFiyatMockMvc = MockMvcBuilders.standaloneSetup(urunFiyatResource)
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
    public static UrunFiyat createEntity(EntityManager em) {
        UrunFiyat urunFiyat = new UrunFiyat()
            .fiyat(DEFAULT_FIYAT)
            .tarih(DEFAULT_TARIH);
        return urunFiyat;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UrunFiyat createUpdatedEntity(EntityManager em) {
        UrunFiyat urunFiyat = new UrunFiyat()
            .fiyat(UPDATED_FIYAT)
            .tarih(UPDATED_TARIH);
        return urunFiyat;
    }

    @BeforeEach
    public void initTest() {
        urunFiyat = createEntity(em);
    }

    @Test
    @Transactional
    @WithMockUser(value = "admin")
    public void createUrunFiyat() throws Exception {
        int databaseSizeBeforeCreate = urunFiyatRepository.findAll().size();

        // Create the UrunFiyat
        restUrunFiyatMockMvc.perform(post("/api/urun-fiyats")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(urunFiyat)))
            .andExpect(status().isCreated());

        // Validate the UrunFiyat in the database
        List<UrunFiyat> urunFiyatList = urunFiyatRepository.findAll();
        assertThat(urunFiyatList).hasSize(databaseSizeBeforeCreate + 1);
        UrunFiyat testUrunFiyat = urunFiyatList.get(urunFiyatList.size() - 1);
        assertThat(testUrunFiyat.getFiyat()).isEqualTo(DEFAULT_FIYAT);
        assertThat(testUrunFiyat.getTarih()).isEqualTo(DEFAULT_TARIH);
    }

    @Test
    @Transactional
    public void createUrunFiyatWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = urunFiyatRepository.findAll().size();

        // Create the UrunFiyat with an existing ID
        urunFiyat.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restUrunFiyatMockMvc.perform(post("/api/urun-fiyats")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(urunFiyat)))
            .andExpect(status().isBadRequest());

        // Validate the UrunFiyat in the database
        List<UrunFiyat> urunFiyatList = urunFiyatRepository.findAll();
        assertThat(urunFiyatList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllUrunFiyats() throws Exception {
        // Initialize the database
        urunFiyatRepository.saveAndFlush(urunFiyat);

        // Get all the urunFiyatList
        restUrunFiyatMockMvc.perform(get("/api/urun-fiyats?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(urunFiyat.getId().intValue())))
            .andExpect(jsonPath("$.[*].fiyat").value(hasItem(DEFAULT_FIYAT.intValue())))
            .andExpect(jsonPath("$.[*].tarih").value(hasItem(sameInstant(DEFAULT_TARIH))));
    }

    @Test
    @Transactional
    public void getUrunFiyat() throws Exception {
        // Initialize the database
        urunFiyatRepository.saveAndFlush(urunFiyat);

        // Get the urunFiyat
        restUrunFiyatMockMvc.perform(get("/api/urun-fiyats/{id}", urunFiyat.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(urunFiyat.getId().intValue()))
            .andExpect(jsonPath("$.fiyat").value(DEFAULT_FIYAT.intValue()))
            .andExpect(jsonPath("$.tarih").value(sameInstant(DEFAULT_TARIH)));
    }

    @Test
    @Transactional
    public void getNonExistingUrunFiyat() throws Exception {
        // Get the urunFiyat
        restUrunFiyatMockMvc.perform(get("/api/urun-fiyats/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    @WithMockUser(value = "admin")
    public void updateUrunFiyat() throws Exception {
        // Initialize the database
        urunFiyatRepository.saveAndFlush(urunFiyat);

        int databaseSizeBeforeUpdate = urunFiyatRepository.findAll().size();

        // Update the urunFiyat
        UrunFiyat updatedUrunFiyat = urunFiyatRepository.findById(urunFiyat.getId()).get();
        // Disconnect from session so that the updates on updatedUrunFiyat are not directly saved in db
        em.detach(updatedUrunFiyat);
        updatedUrunFiyat
            .fiyat(UPDATED_FIYAT)
            .tarih(UPDATED_TARIH);

        restUrunFiyatMockMvc.perform(put("/api/urun-fiyats")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedUrunFiyat)))
            .andExpect(status().isOk());

        // Validate the UrunFiyat in the database
        List<UrunFiyat> urunFiyatList = urunFiyatRepository.findAll();
        assertThat(urunFiyatList).hasSize(databaseSizeBeforeUpdate);
        UrunFiyat testUrunFiyat = urunFiyatList.get(urunFiyatList.size() - 1);
        assertThat(testUrunFiyat.getFiyat()).isEqualTo(UPDATED_FIYAT);
        assertThat(testUrunFiyat.getTarih()).isEqualTo(UPDATED_TARIH);
    }

    @Test
    @Transactional
    public void updateNonExistingUrunFiyat() throws Exception {
        int databaseSizeBeforeUpdate = urunFiyatRepository.findAll().size();

        // Create the UrunFiyat

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUrunFiyatMockMvc.perform(put("/api/urun-fiyats")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(urunFiyat)))
            .andExpect(status().isBadRequest());

        // Validate the UrunFiyat in the database
        List<UrunFiyat> urunFiyatList = urunFiyatRepository.findAll();
        assertThat(urunFiyatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteUrunFiyat() throws Exception {
        // Initialize the database
        urunFiyatRepository.saveAndFlush(urunFiyat);

        int databaseSizeBeforeDelete = urunFiyatRepository.findAll().size();

        // Delete the urunFiyat
        restUrunFiyatMockMvc.perform(delete("/api/urun-fiyats/{id}", urunFiyat.getId())
            .accept(TestUtil.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UrunFiyat> urunFiyatList = urunFiyatRepository.findAll();
        assertThat(urunFiyatList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
