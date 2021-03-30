package com.koop.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.koop.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class KdvKategorisiTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(KdvKategorisi.class);
        KdvKategorisi kdvKategorisi1 = new KdvKategorisi();
        kdvKategorisi1.setId(1L);
        KdvKategorisi kdvKategorisi2 = new KdvKategorisi();
        kdvKategorisi2.setId(kdvKategorisi1.getId());
        assertThat(kdvKategorisi1).isEqualTo(kdvKategorisi2);
        kdvKategorisi2.setId(2L);
        assertThat(kdvKategorisi1).isNotEqualTo(kdvKategorisi2);
        kdvKategorisi1.setId(null);
        assertThat(kdvKategorisi1).isNotEqualTo(kdvKategorisi2);
    }
}
