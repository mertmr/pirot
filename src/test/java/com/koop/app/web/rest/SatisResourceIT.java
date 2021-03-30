package com.koop.app.web.rest;

import static com.koop.app.web.rest.TestUtil.createFormattingConversionService;
import static com.koop.app.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.koop.app.KoopApp;
import com.koop.app.domain.Satis;
import com.koop.app.domain.Urun;
import com.koop.app.domain.User;
import com.koop.app.repository.SatisRepository;
import com.koop.app.repository.UserRepository;
import com.koop.app.service.MailService;
import com.koop.app.service.SatisService;
import com.koop.app.web.rest.errors.ExceptionTranslator;
import com.koop.app.web.rest.errors.UserNotFoundException;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
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
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

/**
 * Integration tests for the {@link SatisResource} REST controller.
 */
@SpringBootTest(classes = KoopApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class SatisResourceIT {

    private static final ZonedDateTime DEFAULT_TARIH = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TARIH = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final BigDecimal DEFAULT_TOPLAM_TUTAR = new BigDecimal(1);
    private static final BigDecimal UPDATED_TOPLAM_TUTAR = new BigDecimal(2);

    private static final Boolean DEFAULT_ORTAGA_SATIS = false;
    private static final Boolean UPDATED_ORTAGA_SATIS = true;

    private static final Boolean DEFAULT_KARTLI_SATIS = false;
    private static final Boolean UPDATED_KARTLI_SATIS = true;

    @Autowired
    private SatisRepository satisRepository;

    @Autowired
    private UserRepository userRepository;

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

    private MockMvc restSatisMockMvc;

    private Satis satis;

    @Autowired
    private SatisService satisService;

    @Autowired
    private MailService mailService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final SatisResource satisResource = new SatisResource(satisRepository, satisService, mailService);
        this.restSatisMockMvc =
            MockMvcBuilders
                .standaloneSetup(satisResource)
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
    public static Satis createEntity(EntityManager em) {
        Satis satis = new Satis()
            .tarih(DEFAULT_TARIH)
            .toplamTutar(DEFAULT_TOPLAM_TUTAR)
            .ortagaSatis(DEFAULT_ORTAGA_SATIS)
            .kartliSatis(DEFAULT_KARTLI_SATIS)
            .stokHareketleriLists(Collections.singleton(SatisStokHareketleriResourceIT.createEntity(em)));
        return satis;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Satis createUpdatedEntity(EntityManager em) {
        Satis satis = new Satis()
            .tarih(UPDATED_TARIH)
            .toplamTutar(UPDATED_TOPLAM_TUTAR)
            .ortagaSatis(UPDATED_ORTAGA_SATIS)
            .kartliSatis(UPDATED_KARTLI_SATIS);
        return satis;
    }

    @BeforeEach
    public void initTest() {
        satis = createEntity(em);
    }

    @Test
    @Transactional
    @WithMockUser(value = "admin")
    public void createSatis() throws Exception {
        int databaseSizeBeforeCreate = satisRepository.findAll().size();
        // Create the Satis
        restSatisMockMvc
            .perform(post("/api/satis").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(satis)))
            .andExpect(status().isCreated());

        // Validate the Satis in the database
        List<Satis> satisList = satisRepository.findAll();
        Urun urun = UrunResourceIT.createEntity(null);
        assertThat(satisList).hasSize(databaseSizeBeforeCreate + 1);
        Satis testSatis = satisList.get(satisList.size() - 1);
        assertThat(testSatis.getTarih()).isEqualTo(DEFAULT_TARIH);
        assertThat(testSatis.getToplamTutar()).isEqualTo(DEFAULT_TOPLAM_TUTAR);
        assertThat(testSatis.isOrtagaSatis()).isEqualTo(DEFAULT_ORTAGA_SATIS);
        assertThat(testSatis.isKartliSatis()).isEqualTo(DEFAULT_KARTLI_SATIS);
        assertThat(testSatis.getStokHareketleriLists().iterator().next().getUrun().getStok())
            .isEqualTo(urun.getStok().subtract(BigDecimal.ONE));
    }

    @Test
    @Transactional
    public void createSatisWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = satisRepository.findAll().size();

        // Create the Satis with an existing ID
        satis.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSatisMockMvc
            .perform(post("/api/satis").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(satis)))
            .andExpect(status().isBadRequest());

        // Validate the Satis in the database
        List<Satis> satisList = satisRepository.findAll();
        assertThat(satisList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllSatis() throws Exception {
        // Initialize the database
        satisRepository.saveAndFlush(satis);

        // Get all the satisList
        restSatisMockMvc
            .perform(get("/api/satis?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(satis.getId().intValue())))
            .andExpect(jsonPath("$.[*].tarih").value(hasItem(sameInstant(DEFAULT_TARIH))))
            .andExpect(jsonPath("$.[*].toplamTutar").value(hasItem(DEFAULT_TOPLAM_TUTAR.intValue())))
            .andExpect(jsonPath("$.[*].ortagaSatis").value(hasItem(DEFAULT_ORTAGA_SATIS.booleanValue())))
            .andExpect(jsonPath("$.[*].kartliSatis").value(hasItem(DEFAULT_KARTLI_SATIS.booleanValue())));
    }

    @Test
    @Transactional
    public void getSatis() throws Exception {
        // Initialize the database
        satisRepository.saveAndFlush(satis);

        // Get the satis
        restSatisMockMvc
            .perform(get("/api/satis/{id}", satis.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(satis.getId().intValue()))
            .andExpect(jsonPath("$.tarih").value(sameInstant(DEFAULT_TARIH)))
            .andExpect(jsonPath("$.toplamTutar").value(DEFAULT_TOPLAM_TUTAR.intValue()))
            .andExpect(jsonPath("$.ortagaSatis").value(DEFAULT_ORTAGA_SATIS.booleanValue()))
            .andExpect(jsonPath("$.kartliSatis").value(DEFAULT_KARTLI_SATIS.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingSatis() throws Exception {
        // Get the satis
        restSatisMockMvc.perform(get("/api/satis/{id}", Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    @WithMockUser(value = "admin")
    public void updateSatis() throws Exception {
        // Initialize the database
        satisRepository.saveAndFlush(satis);

        int databaseSizeBeforeUpdate = satisRepository.findAll().size();

        // Update the satis
        Satis updatedSatis = satisRepository.findById(satis.getId()).get();
        // Disconnect from session so that the updates on updatedSatis are not directly saved in db
        em.detach(updatedSatis);
        updatedSatis
            .tarih(UPDATED_TARIH)
            .toplamTutar(UPDATED_TOPLAM_TUTAR)
            .ortagaSatis(UPDATED_ORTAGA_SATIS)
            .kartliSatis(UPDATED_KARTLI_SATIS);

        restSatisMockMvc
            .perform(put("/api/satis").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(updatedSatis)))
            .andExpect(status().isOk());

        // Validate the Satis in the database
        List<Satis> satisList = satisRepository.findAll();
        assertThat(satisList).hasSize(databaseSizeBeforeUpdate);
        Satis testSatis = satisList.get(satisList.size() - 1);
        assertThat(testSatis.getTarih()).isEqualTo(UPDATED_TARIH);
        assertThat(testSatis.getToplamTutar()).isEqualTo(UPDATED_TOPLAM_TUTAR);
        assertThat(testSatis.isOrtagaSatis()).isEqualTo(UPDATED_ORTAGA_SATIS);
        assertThat(testSatis.isKartliSatis()).isEqualTo(UPDATED_KARTLI_SATIS);
    }

    @Test
    @Transactional
    public void updateNonExistingSatis() throws Exception {
        int databaseSizeBeforeUpdate = satisRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSatisMockMvc
            .perform(put("/api/satis").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(satis)))
            .andExpect(status().isBadRequest());

        // Validate the Satis in the database
        List<Satis> satisList = satisRepository.findAll();
        assertThat(satisList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteSatis() throws Exception {
        // Initialize the database
        satisRepository.saveAndFlush(satis);

        int databaseSizeBeforeDelete = satisRepository.findAll().size();

        // Delete the satis
        restSatisMockMvc
            .perform(delete("/api/satis/{id}", satis.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Satis> satisList = satisRepository.findAll();
        assertThat(satisList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchSatis() throws Exception {
        // Initialize the database
        Optional<User> systemUser = userRepository.findById(1L); //system fake user from fake datas
        satis.setUser(
            systemUser.orElseThrow(
                () -> {
                    throw new UserNotFoundException();
                }
            )
        );
        satisRepository.saveAndFlush(satis);

        // Search the satis
        restSatisMockMvc
            .perform(get("/api/_search/satis?sort=id,desc").param("query", satis.getUser().getLogin()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(satis.getId().intValue()))
            .andExpect(jsonPath("$.[*].toplamTutar").value(DEFAULT_TOPLAM_TUTAR.intValue()))
            .andExpect(jsonPath("$.[*].ortagaSatis").value(DEFAULT_ORTAGA_SATIS.booleanValue()))
            .andExpect(jsonPath("$.[*].kartliSatis").value(DEFAULT_KARTLI_SATIS.booleanValue()));
    }
}
