package com.koop.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.koop.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

public class UrunFiyatTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UrunFiyat.class);
        UrunFiyat urunFiyat1 = new UrunFiyat();
        urunFiyat1.setId(1L);
        UrunFiyat urunFiyat2 = new UrunFiyat();
        urunFiyat2.setId(urunFiyat1.getId());
        assertThat(urunFiyat1).isEqualTo(urunFiyat2);
        urunFiyat2.setId(2L);
        assertThat(urunFiyat1).isNotEqualTo(urunFiyat2);
        urunFiyat1.setId(null);
        assertThat(urunFiyat1).isNotEqualTo(urunFiyat2);
    }
}
