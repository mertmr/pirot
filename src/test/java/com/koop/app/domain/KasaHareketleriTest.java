package com.koop.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.koop.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

public class KasaHareketleriTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(KasaHareketleri.class);
        KasaHareketleri kasaHareketleri1 = new KasaHareketleri();
        kasaHareketleri1.setId(1L);
        KasaHareketleri kasaHareketleri2 = new KasaHareketleri();
        kasaHareketleri2.setId(kasaHareketleri1.getId());
        assertThat(kasaHareketleri1).isEqualTo(kasaHareketleri2);
        kasaHareketleri2.setId(2L);
        assertThat(kasaHareketleri1).isNotEqualTo(kasaHareketleri2);
        kasaHareketleri1.setId(null);
        assertThat(kasaHareketleri1).isNotEqualTo(kasaHareketleri2);
    }
}
