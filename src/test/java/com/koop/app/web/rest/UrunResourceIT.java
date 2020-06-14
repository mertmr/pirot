package com.koop.app.web.rest;

import static com.koop.app.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.koop.app.KoopApp;
import com.koop.app.domain.Urun;
import com.koop.app.domain.enumeration.Birim;
import com.koop.app.domain.enumeration.UrunKategorisi;
import com.koop.app.repository.UrunFiyatRepository;
import com.koop.app.repository.UrunRepository;
import com.koop.app.service.UrunService;
import com.koop.app.service.UserService;
import com.koop.app.web.rest.errors.ExceptionTranslator;
import java.math.BigDecimal;
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
 * Integration tests for the {@link UrunResource} REST controller.
 */
@SpringBootTest(classes = KoopApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class UrunResourceIT {
    private static final String DEFAULT_URUN_ADI = "AAAAAAAAAA";
    private static final String UPDATED_URUN_ADI = "BBBBBBBBBB";

    private static final BigDecimal DEFAULT_STOK = new BigDecimal(1);
    private static final BigDecimal UPDATED_STOK = new BigDecimal(2);

    private static final BigDecimal DEFAULT_STOK_SINIRI = new BigDecimal(1);
    private static final BigDecimal UPDATED_STOK_SINIRI = new BigDecimal(2);

    private static final BigDecimal DEFAULT_MUSTERI_FIYATI = new BigDecimal(1);
    private static final BigDecimal UPDATED_MUSTERI_FIYATI = new BigDecimal(2);

    private static final Birim DEFAULT_BIRIM = Birim.GRAM;
    private static final Birim UPDATED_BIRIM = Birim.ADET;

    private static final Boolean DEFAULT_DAYANISMA_URUNU = false;
    private static final Boolean UPDATED_DAYANISMA_URUNU = true;

    private static final Boolean DEFAULT_SATISTA = false;
    private static final Boolean UPDATED_SATISTA = true;

    private static final UrunKategorisi DEFAULT_URUN_KATEGORISI = UrunKategorisi.GIDA_DISI;
    private static final UrunKategorisi UPDATED_URUN_KATEGORISI = UrunKategorisi.GIDA;

    @Autowired
    private UrunRepository urunRepository;

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

    @Autowired
    private UrunFiyatRepository urunFiyatRepository;

    @Autowired
    private UrunService urunService;

    private MockMvc restUrunMockMvc;

    private Urun urun;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final UrunResource urunResource = new UrunResource(urunRepository, userService, urunService, urunFiyatRepository);
        this.restUrunMockMvc =
            MockMvcBuilders
                .standaloneSetup(urunResource)
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
    public static Urun createEntity(EntityManager em) {
        Urun urun = new Urun()
            .urunAdi(DEFAULT_URUN_ADI)
            .stok(DEFAULT_STOK)
            .stokSiniri(DEFAULT_STOK_SINIRI)
            .musteriFiyati(DEFAULT_MUSTERI_FIYATI)
            .birim(DEFAULT_BIRIM)
            .dayanismaUrunu(DEFAULT_DAYANISMA_URUNU)
            .satista(DEFAULT_SATISTA)
            .urunKategorisi(DEFAULT_URUN_KATEGORISI);
        return urun;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Urun createUpdatedEntity(EntityManager em) {
        Urun urun = new Urun()
            .urunAdi(UPDATED_URUN_ADI)
            .stok(UPDATED_STOK)
            .stokSiniri(UPDATED_STOK_SINIRI)
            .musteriFiyati(UPDATED_MUSTERI_FIYATI)
            .birim(UPDATED_BIRIM)
            .dayanismaUrunu(UPDATED_DAYANISMA_URUNU)
            .satista(UPDATED_SATISTA)
            .urunKategorisi(UPDATED_URUN_KATEGORISI);
        return urun;
    }

    @BeforeEach
    public void initTest() {
        urun = createEntity(em);
    }

    @Test
    @Transactional
    @WithMockUser(value = "admin")
    public void createUrun() throws Exception {
        int databaseSizeBeforeCreate = urunRepository.findAll().size();
        // Create the Urun
        restUrunMockMvc
            .perform(post("/api/uruns").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(urun)))
            .andExpect(status().isCreated());

        // Validate the Urun in the database
        List<Urun> urunList = urunRepository.findAll();
        assertThat(urunList).hasSize(databaseSizeBeforeCreate + 1);
        Urun testUrun = urunList.get(urunList.size() - 1);
        assertThat(testUrun.getUrunAdi()).isEqualTo(DEFAULT_URUN_ADI);
        assertThat(testUrun.getStok()).isEqualTo(DEFAULT_STOK);
        assertThat(testUrun.getStokSiniri()).isEqualTo(DEFAULT_STOK_SINIRI);
        assertThat(testUrun.getMusteriFiyati()).isEqualTo(DEFAULT_MUSTERI_FIYATI);
        assertThat(testUrun.getBirim()).isEqualTo(DEFAULT_BIRIM);
        assertThat(testUrun.isDayanismaUrunu()).isEqualTo(DEFAULT_DAYANISMA_URUNU);
        assertThat(testUrun.isSatista()).isEqualTo(DEFAULT_SATISTA);
        assertThat(testUrun.getUrunKategorisi()).isEqualTo(DEFAULT_URUN_KATEGORISI);
    }

    @Test
    @Transactional
    public void createUrunWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = urunRepository.findAll().size();

        // Create the Urun with an existing ID
        urun.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restUrunMockMvc
            .perform(post("/api/uruns").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(urun)))
            .andExpect(status().isBadRequest());

        // Validate the Urun in the database
        List<Urun> urunList = urunRepository.findAll();
        assertThat(urunList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkUrunAdiIsRequired() throws Exception {
        int databaseSizeBeforeTest = urunRepository.findAll().size();
        // set the field null
        urun.setUrunAdi(null);

        // Create the Urun, which fails.


        restUrunMockMvc.perform(post("/api/uruns")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(urun)))
            .andExpect(status().isBadRequest());

        List<Urun> urunList = urunRepository.findAll();
        assertThat(urunList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkBirimIsRequired() throws Exception {
        int databaseSizeBeforeTest = urunRepository.findAll().size();
        // set the field null
        urun.setBirim(null);

        // Create the Urun, which fails.


        restUrunMockMvc.perform(post("/api/uruns")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(urun)))
            .andExpect(status().isBadRequest());

        List<Urun> urunList = urunRepository.findAll();
        assertThat(urunList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllUruns() throws Exception {
        // Initialize the database
        urunRepository.saveAndFlush(urun);

        // Get all the urunList
        restUrunMockMvc
            .perform(get("/api/uruns?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(urun.getId().intValue())))
            .andExpect(jsonPath("$.[*].urunAdi").value(hasItem(DEFAULT_URUN_ADI)))
            .andExpect(jsonPath("$.[*].stok").value(hasItem(DEFAULT_STOK.intValue())))
            .andExpect(jsonPath("$.[*].stokSiniri").value(hasItem(DEFAULT_STOK_SINIRI.intValue())))
            .andExpect(jsonPath("$.[*].musteriFiyati").value(hasItem(DEFAULT_MUSTERI_FIYATI.intValue())))
            .andExpect(jsonPath("$.[*].birim").value(hasItem(DEFAULT_BIRIM.toString())))
            .andExpect(jsonPath("$.[*].dayanismaUrunu").value(hasItem(DEFAULT_DAYANISMA_URUNU.booleanValue())))
            .andExpect(jsonPath("$.[*].satista").value(hasItem(DEFAULT_SATISTA.booleanValue())))
            .andExpect(jsonPath("$.[*].urunKategorisi").value(hasItem(DEFAULT_URUN_KATEGORISI.toString())));
    }

    @Test
    @Transactional
    public void getUrun() throws Exception {
        // Initialize the database
        urunRepository.saveAndFlush(urun);

        // Get the urun
        restUrunMockMvc
            .perform(get("/api/uruns/{id}", urun.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(urun.getId().intValue()))
            .andExpect(jsonPath("$.urunAdi").value(DEFAULT_URUN_ADI))
            .andExpect(jsonPath("$.stok").value(DEFAULT_STOK.intValue()))
            .andExpect(jsonPath("$.stokSiniri").value(DEFAULT_STOK_SINIRI.intValue()))
            .andExpect(jsonPath("$.musteriFiyati").value(DEFAULT_MUSTERI_FIYATI.intValue()))
            .andExpect(jsonPath("$.birim").value(DEFAULT_BIRIM.toString()))
            .andExpect(jsonPath("$.dayanismaUrunu").value(DEFAULT_DAYANISMA_URUNU.booleanValue()))
            .andExpect(jsonPath("$.satista").value(DEFAULT_SATISTA.booleanValue()))
            .andExpect(jsonPath("$.urunKategorisi").value(DEFAULT_URUN_KATEGORISI.toString()));
    }
    @Test
    @Transactional
    public void getNonExistingUrun() throws Exception {
        // Get the urun
        restUrunMockMvc.perform(get("/api/uruns/{id}", Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    @WithMockUser(value = "admin")
    public void updateUrun() throws Exception {
        // Initialize the database
        urunRepository.saveAndFlush(urun);

        int databaseSizeBeforeUpdate = urunRepository.findAll().size();

        // Update the urun
        Urun updatedUrun = urunRepository.findById(urun.getId()).get();
        // Disconnect from session so that the updates on updatedUrun are not directly saved in db
        em.detach(updatedUrun);
        updatedUrun
            .urunAdi(UPDATED_URUN_ADI)
            .stok(UPDATED_STOK)
            .stokSiniri(UPDATED_STOK_SINIRI)
            .musteriFiyati(UPDATED_MUSTERI_FIYATI)
            .birim(UPDATED_BIRIM)
            .dayanismaUrunu(UPDATED_DAYANISMA_URUNU)
            .satista(UPDATED_SATISTA)
            .urunKategorisi(UPDATED_URUN_KATEGORISI);

        restUrunMockMvc
            .perform(put("/api/uruns").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(updatedUrun)))
            .andExpect(status().isOk());

        // Validate the Urun in the database
        List<Urun> urunList = urunRepository.findAll();
        assertThat(urunList).hasSize(databaseSizeBeforeUpdate);
        Urun testUrun = urunList.get(urunList.size() - 1);
        assertThat(testUrun.getUrunAdi()).isEqualTo(UPDATED_URUN_ADI);
        assertThat(testUrun.getStok()).isEqualTo(UPDATED_STOK);
        assertThat(testUrun.getStokSiniri()).isEqualTo(UPDATED_STOK_SINIRI);
        assertThat(testUrun.getMusteriFiyati()).isEqualTo(UPDATED_MUSTERI_FIYATI);
        assertThat(testUrun.getBirim()).isEqualTo(UPDATED_BIRIM);
        assertThat(testUrun.isDayanismaUrunu()).isEqualTo(UPDATED_DAYANISMA_URUNU);
        assertThat(testUrun.isSatista()).isEqualTo(UPDATED_SATISTA);
        assertThat(testUrun.getUrunKategorisi()).isEqualTo(UPDATED_URUN_KATEGORISI);
    }

    @Test
    @Transactional
    public void updateNonExistingUrun() throws Exception {
        int databaseSizeBeforeUpdate = urunRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUrunMockMvc
            .perform(put("/api/uruns").contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(urun)))
            .andExpect(status().isBadRequest());

        // Validate the Urun in the database
        List<Urun> urunList = urunRepository.findAll();
        assertThat(urunList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteUrun() throws Exception {
        // Initialize the database
        urunRepository.saveAndFlush(urun);

        int databaseSizeBeforeDelete = urunRepository.findAll().size();

        // Delete the urun
        restUrunMockMvc
            .perform(delete("/api/uruns/{id}", urun.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Urun> urunList = urunRepository.findAll();
        assertThat(urunList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
