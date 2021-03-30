package com.koop.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.koop.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UrunFiyatHesapTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UrunFiyatHesap.class);
        UrunFiyatHesap urunFiyatHesap1 = new UrunFiyatHesap();
        urunFiyatHesap1.setId(1L);
        UrunFiyatHesap urunFiyatHesap2 = new UrunFiyatHesap();
        urunFiyatHesap2.setId(urunFiyatHesap1.getId());
        assertThat(urunFiyatHesap1).isEqualTo(urunFiyatHesap2);
        urunFiyatHesap2.setId(2L);
        assertThat(urunFiyatHesap1).isNotEqualTo(urunFiyatHesap2);
        urunFiyatHesap1.setId(null);
        assertThat(urunFiyatHesap1).isNotEqualTo(urunFiyatHesap2);
    }
}
