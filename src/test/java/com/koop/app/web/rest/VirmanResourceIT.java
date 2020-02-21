package com.koop.app.web.rest;

import com.koop.app.KoopApp;
import com.koop.app.domain.Virman;
import com.koop.app.repository.VirmanRepository;
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

import com.koop.app.domain.enumeration.Hesap;
import com.koop.app.domain.enumeration.Hesap;
/**
 * Integration tests for the {@link VirmanResource} REST controller.
 */
@SpringBootTest(classes = KoopApp.class)
public class VirmanResourceIT {

    private static final BigDecimal DEFAULT_TUTAR = new BigDecimal(1);
    private static final BigDecimal UPDATED_TUTAR = new BigDecimal(2);

    private static final String DEFAULT_NOTLAR = "AAAAAAAAAA";
    private static final String UPDATED_NOTLAR = "BBBBBBBBBB";

    private static final Hesap DEFAULT_CIKIS_HESABI = Hesap.YOK;
    private static final Hesap UPDATED_CIKIS_HESABI = Hesap.KASA;

    private static final Hesap DEFAULT_GIRIS_HESABI = Hesap.YOK;
    private static final Hesap UPDATED_GIRIS_HESABI = Hesap.KASA;

    private static final ZonedDateTime DEFAULT_TARIH = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TARIH = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private VirmanRepository virmanRepository;

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

    private MockMvc restVirmanMockMvc;

    private Virman virman;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final VirmanResource virmanResource = new VirmanResource(virmanRepository);
        this.restVirmanMockMvc = MockMvcBuilders.standaloneSetup(virmanResource)
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
    public static Virman createEntity(EntityManager em) {
        Virman virman = new Virman()
            .tutar(DEFAULT_TUTAR)
            .notlar(DEFAULT_NOTLAR)
            .cikisHesabi(DEFAULT_CIKIS_HESABI)
            .girisHesabi(DEFAULT_GIRIS_HESABI)
            .tarih(DEFAULT_TARIH);
        return virman;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Virman createUpdatedEntity(EntityManager em) {
        Virman virman = new Virman()
            .tutar(UPDATED_TUTAR)
            .notlar(UPDATED_NOTLAR)
            .cikisHesabi(UPDATED_CIKIS_HESABI)
            .girisHesabi(UPDATED_GIRIS_HESABI)
            .tarih(UPDATED_TARIH);
        return virman;
    }

    @BeforeEach
    public void initTest() {
        virman = createEntity(em);
    }

    @Test
    @Transactional
    public void createVirman() throws Exception {
        int databaseSizeBeforeCreate = virmanRepository.findAll().size();

        // Create the Virman
        restVirmanMockMvc.perform(post("/api/virmen")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(virman)))
            .andExpect(status().isCreated());

        // Validate the Virman in the database
        List<Virman> virmanList = virmanRepository.findAll();
        assertThat(virmanList).hasSize(databaseSizeBeforeCreate + 1);
        Virman testVirman = virmanList.get(virmanList.size() - 1);
        assertThat(testVirman.getTutar()).isEqualTo(DEFAULT_TUTAR);
        assertThat(testVirman.getNotlar()).isEqualTo(DEFAULT_NOTLAR);
        assertThat(testVirman.getCikisHesabi()).isEqualTo(DEFAULT_CIKIS_HESABI);
        assertThat(testVirman.getGirisHesabi()).isEqualTo(DEFAULT_GIRIS_HESABI);
        assertThat(testVirman.getTarih()).isEqualTo(DEFAULT_TARIH);
    }

    @Test
    @Transactional
    public void createVirmanWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = virmanRepository.findAll().size();

        // Create the Virman with an existing ID
        virman.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restVirmanMockMvc.perform(post("/api/virmen")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(virman)))
            .andExpect(status().isBadRequest());

        // Validate the Virman in the database
        List<Virman> virmanList = virmanRepository.findAll();
        assertThat(virmanList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkTutarIsRequired() throws Exception {
        int databaseSizeBeforeTest = virmanRepository.findAll().size();
        // set the field null
        virman.setTutar(null);

        // Create the Virman, which fails.

        restVirmanMockMvc.perform(post("/api/virmen")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(virman)))
            .andExpect(status().isBadRequest());

        List<Virman> virmanList = virmanRepository.findAll();
        assertThat(virmanList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkNotlarIsRequired() throws Exception {
        int databaseSizeBeforeTest = virmanRepository.findAll().size();
        // set the field null
        virman.setNotlar(null);

        // Create the Virman, which fails.

        restVirmanMockMvc.perform(post("/api/virmen")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(virman)))
            .andExpect(status().isBadRequest());

        List<Virman> virmanList = virmanRepository.findAll();
        assertThat(virmanList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllVirmen() throws Exception {
        // Initialize the database
        virmanRepository.saveAndFlush(virman);

        // Get all the virmanList
        restVirmanMockMvc.perform(get("/api/virmen?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(virman.getId().intValue())))
            .andExpect(jsonPath("$.[*].tutar").value(hasItem(DEFAULT_TUTAR.intValue())))
            .andExpect(jsonPath("$.[*].notlar").value(hasItem(DEFAULT_NOTLAR)))
            .andExpect(jsonPath("$.[*].cikisHesabi").value(hasItem(DEFAULT_CIKIS_HESABI.toString())))
            .andExpect(jsonPath("$.[*].girisHesabi").value(hasItem(DEFAULT_GIRIS_HESABI.toString())))
            .andExpect(jsonPath("$.[*].tarih").value(hasItem(sameInstant(DEFAULT_TARIH))));
    }
    
    @Test
    @Transactional
    public void getVirman() throws Exception {
        // Initialize the database
        virmanRepository.saveAndFlush(virman);

        // Get the virman
        restVirmanMockMvc.perform(get("/api/virmen/{id}", virman.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(virman.getId().intValue()))
            .andExpect(jsonPath("$.tutar").value(DEFAULT_TUTAR.intValue()))
            .andExpect(jsonPath("$.notlar").value(DEFAULT_NOTLAR))
            .andExpect(jsonPath("$.cikisHesabi").value(DEFAULT_CIKIS_HESABI.toString()))
            .andExpect(jsonPath("$.girisHesabi").value(DEFAULT_GIRIS_HESABI.toString()))
            .andExpect(jsonPath("$.tarih").value(sameInstant(DEFAULT_TARIH)));
    }

    @Test
    @Transactional
    public void getNonExistingVirman() throws Exception {
        // Get the virman
        restVirmanMockMvc.perform(get("/api/virmen/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateVirman() throws Exception {
        // Initialize the database
        virmanRepository.saveAndFlush(virman);

        int databaseSizeBeforeUpdate = virmanRepository.findAll().size();

        // Update the virman
        Virman updatedVirman = virmanRepository.findById(virman.getId()).get();
        // Disconnect from session so that the updates on updatedVirman are not directly saved in db
        em.detach(updatedVirman);
        updatedVirman
            .tutar(UPDATED_TUTAR)
            .notlar(UPDATED_NOTLAR)
            .cikisHesabi(UPDATED_CIKIS_HESABI)
            .girisHesabi(UPDATED_GIRIS_HESABI)
            .tarih(UPDATED_TARIH);

        restVirmanMockMvc.perform(put("/api/virmen")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedVirman)))
            .andExpect(status().isOk());

        // Validate the Virman in the database
        List<Virman> virmanList = virmanRepository.findAll();
        assertThat(virmanList).hasSize(databaseSizeBeforeUpdate);
        Virman testVirman = virmanList.get(virmanList.size() - 1);
        assertThat(testVirman.getTutar()).isEqualTo(UPDATED_TUTAR);
        assertThat(testVirman.getNotlar()).isEqualTo(UPDATED_NOTLAR);
        assertThat(testVirman.getCikisHesabi()).isEqualTo(UPDATED_CIKIS_HESABI);
        assertThat(testVirman.getGirisHesabi()).isEqualTo(UPDATED_GIRIS_HESABI);
        assertThat(testVirman.getTarih()).isEqualTo(UPDATED_TARIH);
    }

    @Test
    @Transactional
    public void updateNonExistingVirman() throws Exception {
        int databaseSizeBeforeUpdate = virmanRepository.findAll().size();

        // Create the Virman

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVirmanMockMvc.perform(put("/api/virmen")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(virman)))
            .andExpect(status().isBadRequest());

        // Validate the Virman in the database
        List<Virman> virmanList = virmanRepository.findAll();
        assertThat(virmanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteVirman() throws Exception {
        // Initialize the database
        virmanRepository.saveAndFlush(virman);

        int databaseSizeBeforeDelete = virmanRepository.findAll().size();

        // Delete the virman
        restVirmanMockMvc.perform(delete("/api/virmen/{id}", virman.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Virman> virmanList = virmanRepository.findAll();
        assertThat(virmanList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
