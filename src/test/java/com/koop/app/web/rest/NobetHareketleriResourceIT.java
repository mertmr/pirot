package com.koop.app.web.rest;

import static com.koop.app.web.rest.TestUtil.createFormattingConversionService;
import static com.koop.app.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.koop.app.KoopApp;
import com.koop.app.domain.NobetHareketleri;
import com.koop.app.repository.NobetHareketleriRepository;
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
 * Integration tests for the {@link NobetHareketleriResource} REST controller.
 */
@SpringBootTest(classes = KoopApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class NobetHareketleriResourceIT {
    private static final BigDecimal DEFAULT_KASA = new BigDecimal(1);
    private static final BigDecimal UPDATED_KASA = new BigDecimal(2);

    private static final BigDecimal DEFAULT_PIROT = new BigDecimal(1);
    private static final BigDecimal UPDATED_PIROT = new BigDecimal(2);

    private static final BigDecimal DEFAULT_FARK = new BigDecimal(1);
    private static final BigDecimal UPDATED_FARK = new BigDecimal(2);

    private static final BigDecimal DEFAULT_NOBET_SURESI = new BigDecimal(1);
    private static final BigDecimal UPDATED_NOBET_SURESI = new BigDecimal(2);

    private static final String DEFAULT_NOTLAR = "AAAAAAAAAA";
    private static final String UPDATED_NOTLAR = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_TARIH = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TARIH = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private NobetHareketleriRepository nobetHareketleriRepository;

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

    private MockMvc restNobetHareketleriMockMvc;

    private NobetHareketleri nobetHareketleri;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final NobetHareketleriResource nobetHareketleriResource = new NobetHareketleriResource(nobetHareketleriRepository, userService);
        this.restNobetHareketleriMockMvc =
            MockMvcBuilders
                .standaloneSetup(nobetHareketleriResource)
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
    public static NobetHareketleri createEntity(EntityManager em) {
        NobetHareketleri nobetHareketleri = new NobetHareketleri()
            .kasa(DEFAULT_KASA)
            .pirot(DEFAULT_PIROT)
            .fark(DEFAULT_FARK)
            .nobetSuresi(DEFAULT_NOBET_SURESI)
            .notlar(DEFAULT_NOTLAR)
            .tarih(DEFAULT_TARIH);
        return nobetHareketleri;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static NobetHareketleri createUpdatedEntity(EntityManager em) {
        NobetHareketleri nobetHareketleri = new NobetHareketleri()
            .kasa(UPDATED_KASA)
            .pirot(UPDATED_PIROT)
            .fark(UPDATED_FARK)
            .nobetSuresi(UPDATED_NOBET_SURESI)
            .notlar(UPDATED_NOTLAR)
            .tarih(UPDATED_TARIH);
        return nobetHareketleri;
    }

    @BeforeEach
    public void initTest() {
        nobetHareketleri = createEntity(em);
    }

    @Test
    @Transactional
    @WithMockUser(value = "admin")
    public void createNobetHareketleri() throws Exception {
        int databaseSizeBeforeCreate = nobetHareketleriRepository.findAll().size();

        // Create the NobetHareketleri
        restNobetHareketleriMockMvc
            .perform(
                post("/api/nobet-hareketleris")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(nobetHareketleri))
            )
            .andExpect(status().isCreated());

        // Validate the NobetHareketleri in the database
        List<NobetHareketleri> nobetHareketleriList = nobetHareketleriRepository.findAll();
        assertThat(nobetHareketleriList).hasSize(databaseSizeBeforeCreate + 1);
        NobetHareketleri testNobetHareketleri = nobetHareketleriList.get(nobetHareketleriList.size() - 1);
        assertThat(testNobetHareketleri.getKasa()).isEqualTo(DEFAULT_KASA);
        assertThat(testNobetHareketleri.getPirot()).isEqualTo(DEFAULT_PIROT);
        assertThat(testNobetHareketleri.getFark()).isEqualTo(DEFAULT_FARK);
        assertThat(testNobetHareketleri.getNobetSuresi()).isEqualTo(DEFAULT_NOBET_SURESI);
        assertThat(testNobetHareketleri.getNotlar()).isEqualTo(DEFAULT_NOTLAR);
        assertThat(testNobetHareketleri.getTarih()).isEqualTo(DEFAULT_TARIH);
    }

    @Test
    @Transactional
    public void createNobetHareketleriWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = nobetHareketleriRepository.findAll().size();

        // Create the NobetHareketleri with an existing ID
        nobetHareketleri.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restNobetHareketleriMockMvc
            .perform(
                post("/api/nobet-hareketleris")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(nobetHareketleri))
            )
            .andExpect(status().isBadRequest());

        // Validate the NobetHareketleri in the database
        List<NobetHareketleri> nobetHareketleriList = nobetHareketleriRepository.findAll();
        assertThat(nobetHareketleriList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllNobetHareketleris() throws Exception {
        // Initialize the database
        nobetHareketleriRepository.saveAndFlush(nobetHareketleri);

        // Get all the nobetHareketleriList
        restNobetHareketleriMockMvc
            .perform(get("/api/nobet-hareketleris?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(nobetHareketleri.getId().intValue())))
            .andExpect(jsonPath("$.[*].kasa").value(hasItem(DEFAULT_KASA.intValue())))
            .andExpect(jsonPath("$.[*].pirot").value(hasItem(DEFAULT_PIROT.intValue())))
            .andExpect(jsonPath("$.[*].fark").value(hasItem(DEFAULT_FARK.intValue())))
            .andExpect(jsonPath("$.[*].nobetSuresi").value(hasItem(DEFAULT_NOBET_SURESI.intValue())))
            .andExpect(jsonPath("$.[*].notlar").value(hasItem(DEFAULT_NOTLAR)))
            .andExpect(jsonPath("$.[*].tarih").value(hasItem(sameInstant(DEFAULT_TARIH))));
    }

    @Test
    @Transactional
    public void getNobetHareketleri() throws Exception {
        // Initialize the database
        nobetHareketleriRepository.saveAndFlush(nobetHareketleri);

        // Get the nobetHareketleri
        restNobetHareketleriMockMvc
            .perform(get("/api/nobet-hareketleris/{id}", nobetHareketleri.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(nobetHareketleri.getId().intValue()))
            .andExpect(jsonPath("$.kasa").value(DEFAULT_KASA.intValue()))
            .andExpect(jsonPath("$.pirot").value(DEFAULT_PIROT.intValue()))
            .andExpect(jsonPath("$.fark").value(DEFAULT_FARK.intValue()))
            .andExpect(jsonPath("$.nobetSuresi").value(DEFAULT_NOBET_SURESI.intValue()))
            .andExpect(jsonPath("$.notlar").value(DEFAULT_NOTLAR))
            .andExpect(jsonPath("$.tarih").value(sameInstant(DEFAULT_TARIH)));
    }

    @Test
    @Transactional
    public void getNonExistingNobetHareketleri() throws Exception {
        // Get the nobetHareketleri
        restNobetHareketleriMockMvc.perform(get("/api/nobet-hareketleris/{id}", Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    @WithMockUser(value = "admin")
    public void updateNobetHareketleri() throws Exception {
        // Initialize the database
        nobetHareketleriRepository.saveAndFlush(nobetHareketleri);

        int databaseSizeBeforeUpdate = nobetHareketleriRepository.findAll().size();

        // Update the nobetHareketleri
        NobetHareketleri updatedNobetHareketleri = nobetHareketleriRepository.findById(nobetHareketleri.getId()).get();
        // Disconnect from session so that the updates on updatedNobetHareketleri are not directly saved in db
        em.detach(updatedNobetHareketleri);
        updatedNobetHareketleri
            .kasa(UPDATED_KASA)
            .pirot(UPDATED_PIROT)
            .fark(UPDATED_FARK)
            .nobetSuresi(UPDATED_NOBET_SURESI)
            .notlar(UPDATED_NOTLAR)
            .tarih(UPDATED_TARIH);

        restNobetHareketleriMockMvc
            .perform(
                put("/api/nobet-hareketleris")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedNobetHareketleri))
            )
            .andExpect(status().isOk());

        // Validate the NobetHareketleri in the database
        List<NobetHareketleri> nobetHareketleriList = nobetHareketleriRepository.findAll();
        assertThat(nobetHareketleriList).hasSize(databaseSizeBeforeUpdate);
        NobetHareketleri testNobetHareketleri = nobetHareketleriList.get(nobetHareketleriList.size() - 1);
        assertThat(testNobetHareketleri.getKasa()).isEqualTo(UPDATED_KASA);
        assertThat(testNobetHareketleri.getPirot()).isEqualTo(UPDATED_PIROT);
        assertThat(testNobetHareketleri.getFark()).isEqualTo(UPDATED_FARK);
        assertThat(testNobetHareketleri.getNobetSuresi()).isEqualTo(UPDATED_NOBET_SURESI);
        assertThat(testNobetHareketleri.getNotlar()).isEqualTo(UPDATED_NOTLAR);
        assertThat(testNobetHareketleri.getTarih()).isEqualTo(UPDATED_TARIH);
    }

    @Test
    @Transactional
    public void updateNonExistingNobetHareketleri() throws Exception {
        int databaseSizeBeforeUpdate = nobetHareketleriRepository.findAll().size();

        // Create the NobetHareketleri

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restNobetHareketleriMockMvc
            .perform(
                put("/api/nobet-hareketleris")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(nobetHareketleri))
            )
            .andExpect(status().isBadRequest());

        // Validate the NobetHareketleri in the database
        List<NobetHareketleri> nobetHareketleriList = nobetHareketleriRepository.findAll();
        assertThat(nobetHareketleriList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteNobetHareketleri() throws Exception {
        // Initialize the database
        nobetHareketleriRepository.saveAndFlush(nobetHareketleri);

        int databaseSizeBeforeDelete = nobetHareketleriRepository.findAll().size();

        // Delete the nobetHareketleri
        restNobetHareketleriMockMvc
            .perform(delete("/api/nobet-hareketleris/{id}", nobetHareketleri.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<NobetHareketleri> nobetHareketleriList = nobetHareketleriRepository.findAll();
        assertThat(nobetHareketleriList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
