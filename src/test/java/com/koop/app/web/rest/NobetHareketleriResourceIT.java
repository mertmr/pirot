package com.koop.app.web.rest;

import static com.koop.app.web.rest.TestUtil.sameInstant;
import static com.koop.app.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.koop.app.IntegrationTest;
import com.koop.app.domain.NobetHareketleri;
import com.koop.app.domain.enumeration.AcilisKapanis;
import com.koop.app.repository.NobetHareketleriRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link NobetHareketleriResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class NobetHareketleriResourceIT {

    private static final BigDecimal DEFAULT_KASA = new BigDecimal(1);
    private static final BigDecimal UPDATED_KASA = new BigDecimal(2);

    private static final BigDecimal DEFAULT_PIROT = new BigDecimal(1);
    private static final BigDecimal UPDATED_PIROT = new BigDecimal(2);

    private static final BigDecimal DEFAULT_FARK = new BigDecimal(1);
    private static final BigDecimal UPDATED_FARK = new BigDecimal(2);

    private static final BigDecimal DEFAULT_FARK_DENGE = new BigDecimal(1);
    private static final BigDecimal UPDATED_FARK_DENGE = new BigDecimal(2);

    private static final BigDecimal DEFAULT_NOBET_SURESI = new BigDecimal(1);
    private static final BigDecimal UPDATED_NOBET_SURESI = new BigDecimal(2);

    private static final String DEFAULT_NOTLAR = "AAAAAAAAAA";
    private static final String UPDATED_NOTLAR = "BBBBBBBBBB";

    private static final AcilisKapanis DEFAULT_ACILIS_KAPANIS = AcilisKapanis.ACILIS;
    private static final AcilisKapanis UPDATED_ACILIS_KAPANIS = AcilisKapanis.KAPANIS;

    private static final ZonedDateTime DEFAULT_TARIH = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TARIH = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/nobet-hareketleris";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private NobetHareketleriRepository nobetHareketleriRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restNobetHareketleriMockMvc;

    private NobetHareketleri nobetHareketleri;

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
            .farkDenge(DEFAULT_FARK_DENGE)
            .nobetSuresi(DEFAULT_NOBET_SURESI)
            .notlar(DEFAULT_NOTLAR)
            .acilisKapanis(DEFAULT_ACILIS_KAPANIS)
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
            .farkDenge(UPDATED_FARK_DENGE)
            .nobetSuresi(UPDATED_NOBET_SURESI)
            .notlar(UPDATED_NOTLAR)
            .acilisKapanis(UPDATED_ACILIS_KAPANIS)
            .tarih(UPDATED_TARIH);
        return nobetHareketleri;
    }

    @BeforeEach
    public void initTest() {
        nobetHareketleri = createEntity(em);
    }

    @Test
    @Transactional
    void createNobetHareketleri() throws Exception {
        int databaseSizeBeforeCreate = nobetHareketleriRepository.findAll().size();
        // Create the NobetHareketleri
        restNobetHareketleriMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(nobetHareketleri))
            )
            .andExpect(status().isCreated());

        // Validate the NobetHareketleri in the database
        List<NobetHareketleri> nobetHareketleriList = nobetHareketleriRepository.findAll();
        assertThat(nobetHareketleriList).hasSize(databaseSizeBeforeCreate + 1);
        NobetHareketleri testNobetHareketleri = nobetHareketleriList.get(nobetHareketleriList.size() - 1);
        assertThat(testNobetHareketleri.getKasa()).isEqualByComparingTo(DEFAULT_KASA);
        assertThat(testNobetHareketleri.getPirot()).isEqualByComparingTo(DEFAULT_PIROT);
        assertThat(testNobetHareketleri.getFark()).isEqualByComparingTo(DEFAULT_FARK);
        assertThat(testNobetHareketleri.getFarkDenge()).isEqualByComparingTo(DEFAULT_FARK_DENGE);
        assertThat(testNobetHareketleri.getNobetSuresi()).isEqualByComparingTo(DEFAULT_NOBET_SURESI);
        assertThat(testNobetHareketleri.getNotlar()).isEqualTo(DEFAULT_NOTLAR);
        assertThat(testNobetHareketleri.getAcilisKapanis()).isEqualTo(DEFAULT_ACILIS_KAPANIS);
        assertThat(testNobetHareketleri.getTarih()).isEqualTo(DEFAULT_TARIH);
    }

    @Test
    @Transactional
    void createNobetHareketleriWithExistingId() throws Exception {
        // Create the NobetHareketleri with an existing ID
        nobetHareketleri.setId(1L);

        int databaseSizeBeforeCreate = nobetHareketleriRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restNobetHareketleriMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(nobetHareketleri))
            )
            .andExpect(status().isBadRequest());

        // Validate the NobetHareketleri in the database
        List<NobetHareketleri> nobetHareketleriList = nobetHareketleriRepository.findAll();
        assertThat(nobetHareketleriList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllNobetHareketleris() throws Exception {
        // Initialize the database
        nobetHareketleriRepository.saveAndFlush(nobetHareketleri);

        // Get all the nobetHareketleriList
        restNobetHareketleriMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(nobetHareketleri.getId().intValue())))
            .andExpect(jsonPath("$.[*].kasa").value(hasItem(sameNumber(DEFAULT_KASA))))
            .andExpect(jsonPath("$.[*].pirot").value(hasItem(sameNumber(DEFAULT_PIROT))))
            .andExpect(jsonPath("$.[*].fark").value(hasItem(sameNumber(DEFAULT_FARK))))
            .andExpect(jsonPath("$.[*].farkDenge").value(hasItem(sameNumber(DEFAULT_FARK_DENGE))))
            .andExpect(jsonPath("$.[*].nobetSuresi").value(hasItem(sameNumber(DEFAULT_NOBET_SURESI))))
            .andExpect(jsonPath("$.[*].notlar").value(hasItem(DEFAULT_NOTLAR)))
            .andExpect(jsonPath("$.[*].acilisKapanis").value(hasItem(DEFAULT_ACILIS_KAPANIS.toString())))
            .andExpect(jsonPath("$.[*].tarih").value(hasItem(sameInstant(DEFAULT_TARIH))));
    }

    @Test
    @Transactional
    void getNobetHareketleri() throws Exception {
        // Initialize the database
        nobetHareketleriRepository.saveAndFlush(nobetHareketleri);

        // Get the nobetHareketleri
        restNobetHareketleriMockMvc
            .perform(get(ENTITY_API_URL_ID, nobetHareketleri.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(nobetHareketleri.getId().intValue()))
            .andExpect(jsonPath("$.kasa").value(sameNumber(DEFAULT_KASA)))
            .andExpect(jsonPath("$.pirot").value(sameNumber(DEFAULT_PIROT)))
            .andExpect(jsonPath("$.fark").value(sameNumber(DEFAULT_FARK)))
            .andExpect(jsonPath("$.farkDenge").value(sameNumber(DEFAULT_FARK_DENGE)))
            .andExpect(jsonPath("$.nobetSuresi").value(sameNumber(DEFAULT_NOBET_SURESI)))
            .andExpect(jsonPath("$.notlar").value(DEFAULT_NOTLAR))
            .andExpect(jsonPath("$.acilisKapanis").value(DEFAULT_ACILIS_KAPANIS.toString()))
            .andExpect(jsonPath("$.tarih").value(sameInstant(DEFAULT_TARIH)));
    }

    @Test
    @Transactional
    void getNonExistingNobetHareketleri() throws Exception {
        // Get the nobetHareketleri
        restNobetHareketleriMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewNobetHareketleri() throws Exception {
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
            .farkDenge(UPDATED_FARK_DENGE)
            .nobetSuresi(UPDATED_NOBET_SURESI)
            .notlar(UPDATED_NOTLAR)
            .acilisKapanis(UPDATED_ACILIS_KAPANIS)
            .tarih(UPDATED_TARIH);

        restNobetHareketleriMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedNobetHareketleri.getId())
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
        assertThat(testNobetHareketleri.getFarkDenge()).isEqualTo(UPDATED_FARK_DENGE);
        assertThat(testNobetHareketleri.getNobetSuresi()).isEqualTo(UPDATED_NOBET_SURESI);
        assertThat(testNobetHareketleri.getNotlar()).isEqualTo(UPDATED_NOTLAR);
        assertThat(testNobetHareketleri.getAcilisKapanis()).isEqualTo(UPDATED_ACILIS_KAPANIS);
        assertThat(testNobetHareketleri.getTarih()).isEqualTo(UPDATED_TARIH);
    }

    @Test
    @Transactional
    void putNonExistingNobetHareketleri() throws Exception {
        int databaseSizeBeforeUpdate = nobetHareketleriRepository.findAll().size();
        nobetHareketleri.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restNobetHareketleriMockMvc
            .perform(
                put(ENTITY_API_URL_ID, nobetHareketleri.getId())
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
    void putWithIdMismatchNobetHareketleri() throws Exception {
        int databaseSizeBeforeUpdate = nobetHareketleriRepository.findAll().size();
        nobetHareketleri.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNobetHareketleriMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
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
    void putWithMissingIdPathParamNobetHareketleri() throws Exception {
        int databaseSizeBeforeUpdate = nobetHareketleriRepository.findAll().size();
        nobetHareketleri.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNobetHareketleriMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(nobetHareketleri))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the NobetHareketleri in the database
        List<NobetHareketleri> nobetHareketleriList = nobetHareketleriRepository.findAll();
        assertThat(nobetHareketleriList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateNobetHareketleriWithPatch() throws Exception {
        // Initialize the database
        nobetHareketleriRepository.saveAndFlush(nobetHareketleri);

        int databaseSizeBeforeUpdate = nobetHareketleriRepository.findAll().size();

        // Update the nobetHareketleri using partial update
        NobetHareketleri partialUpdatedNobetHareketleri = new NobetHareketleri();
        partialUpdatedNobetHareketleri.setId(nobetHareketleri.getId());

        partialUpdatedNobetHareketleri
            .kasa(UPDATED_KASA)
            .pirot(UPDATED_PIROT)
            .fark(UPDATED_FARK)
            .nobetSuresi(UPDATED_NOBET_SURESI)
            .notlar(UPDATED_NOTLAR)
            .tarih(UPDATED_TARIH);

        restNobetHareketleriMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedNobetHareketleri.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedNobetHareketleri))
            )
            .andExpect(status().isOk());

        // Validate the NobetHareketleri in the database
        List<NobetHareketleri> nobetHareketleriList = nobetHareketleriRepository.findAll();
        assertThat(nobetHareketleriList).hasSize(databaseSizeBeforeUpdate);
        NobetHareketleri testNobetHareketleri = nobetHareketleriList.get(nobetHareketleriList.size() - 1);
        assertThat(testNobetHareketleri.getKasa()).isEqualByComparingTo(UPDATED_KASA);
        assertThat(testNobetHareketleri.getPirot()).isEqualByComparingTo(UPDATED_PIROT);
        assertThat(testNobetHareketleri.getFark()).isEqualByComparingTo(UPDATED_FARK);
        assertThat(testNobetHareketleri.getFarkDenge()).isEqualByComparingTo(DEFAULT_FARK_DENGE);
        assertThat(testNobetHareketleri.getNobetSuresi()).isEqualByComparingTo(UPDATED_NOBET_SURESI);
        assertThat(testNobetHareketleri.getNotlar()).isEqualTo(UPDATED_NOTLAR);
        assertThat(testNobetHareketleri.getAcilisKapanis()).isEqualTo(DEFAULT_ACILIS_KAPANIS);
        assertThat(testNobetHareketleri.getTarih()).isEqualTo(UPDATED_TARIH);
    }

    @Test
    @Transactional
    void fullUpdateNobetHareketleriWithPatch() throws Exception {
        // Initialize the database
        nobetHareketleriRepository.saveAndFlush(nobetHareketleri);

        int databaseSizeBeforeUpdate = nobetHareketleriRepository.findAll().size();

        // Update the nobetHareketleri using partial update
        NobetHareketleri partialUpdatedNobetHareketleri = new NobetHareketleri();
        partialUpdatedNobetHareketleri.setId(nobetHareketleri.getId());

        partialUpdatedNobetHareketleri
            .kasa(UPDATED_KASA)
            .pirot(UPDATED_PIROT)
            .fark(UPDATED_FARK)
            .farkDenge(UPDATED_FARK_DENGE)
            .nobetSuresi(UPDATED_NOBET_SURESI)
            .notlar(UPDATED_NOTLAR)
            .acilisKapanis(UPDATED_ACILIS_KAPANIS)
            .tarih(UPDATED_TARIH);

        restNobetHareketleriMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedNobetHareketleri.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedNobetHareketleri))
            )
            .andExpect(status().isOk());

        // Validate the NobetHareketleri in the database
        List<NobetHareketleri> nobetHareketleriList = nobetHareketleriRepository.findAll();
        assertThat(nobetHareketleriList).hasSize(databaseSizeBeforeUpdate);
        NobetHareketleri testNobetHareketleri = nobetHareketleriList.get(nobetHareketleriList.size() - 1);
        assertThat(testNobetHareketleri.getKasa()).isEqualByComparingTo(UPDATED_KASA);
        assertThat(testNobetHareketleri.getPirot()).isEqualByComparingTo(UPDATED_PIROT);
        assertThat(testNobetHareketleri.getFark()).isEqualByComparingTo(UPDATED_FARK);
        assertThat(testNobetHareketleri.getFarkDenge()).isEqualByComparingTo(UPDATED_FARK_DENGE);
        assertThat(testNobetHareketleri.getNobetSuresi()).isEqualByComparingTo(UPDATED_NOBET_SURESI);
        assertThat(testNobetHareketleri.getNotlar()).isEqualTo(UPDATED_NOTLAR);
        assertThat(testNobetHareketleri.getAcilisKapanis()).isEqualTo(UPDATED_ACILIS_KAPANIS);
        assertThat(testNobetHareketleri.getTarih()).isEqualTo(UPDATED_TARIH);
    }

    @Test
    @Transactional
    void patchNonExistingNobetHareketleri() throws Exception {
        int databaseSizeBeforeUpdate = nobetHareketleriRepository.findAll().size();
        nobetHareketleri.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restNobetHareketleriMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, nobetHareketleri.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(nobetHareketleri))
            )
            .andExpect(status().isBadRequest());

        // Validate the NobetHareketleri in the database
        List<NobetHareketleri> nobetHareketleriList = nobetHareketleriRepository.findAll();
        assertThat(nobetHareketleriList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchNobetHareketleri() throws Exception {
        int databaseSizeBeforeUpdate = nobetHareketleriRepository.findAll().size();
        nobetHareketleri.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNobetHareketleriMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(nobetHareketleri))
            )
            .andExpect(status().isBadRequest());

        // Validate the NobetHareketleri in the database
        List<NobetHareketleri> nobetHareketleriList = nobetHareketleriRepository.findAll();
        assertThat(nobetHareketleriList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamNobetHareketleri() throws Exception {
        int databaseSizeBeforeUpdate = nobetHareketleriRepository.findAll().size();
        nobetHareketleri.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restNobetHareketleriMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(nobetHareketleri))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the NobetHareketleri in the database
        List<NobetHareketleri> nobetHareketleriList = nobetHareketleriRepository.findAll();
        assertThat(nobetHareketleriList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteNobetHareketleri() throws Exception {
        // Initialize the database
        nobetHareketleriRepository.saveAndFlush(nobetHareketleri);

        int databaseSizeBeforeDelete = nobetHareketleriRepository.findAll().size();

        // Delete the nobetHareketleri
        restNobetHareketleriMockMvc
            .perform(delete(ENTITY_API_URL_ID, nobetHareketleri.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<NobetHareketleri> nobetHareketleriList = nobetHareketleriRepository.findAll();
        assertThat(nobetHareketleriList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
