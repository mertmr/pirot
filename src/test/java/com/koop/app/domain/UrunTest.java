package com.koop.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.koop.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UrunTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Urun.class);
        Urun urun1 = new Urun();
        urun1.setId(1L);
        Urun urun2 = new Urun();
        urun2.setId(urun1.getId());
        assertThat(urun1).isEqualTo(urun2);
        urun2.setId(2L);
        assertThat(urun1).isNotEqualTo(urun2);
        urun1.setId(null);
        assertThat(urun1).isNotEqualTo(urun2);
    }
}
