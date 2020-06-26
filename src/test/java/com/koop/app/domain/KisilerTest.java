package com.koop.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.koop.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

public class KisilerTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Kisiler.class);
        Kisiler kisiler1 = new Kisiler();
        kisiler1.setId(1L);
        Kisiler kisiler2 = new Kisiler();
        kisiler2.setId(kisiler1.getId());
        assertThat(kisiler1).isEqualTo(kisiler2);
        kisiler2.setId(2L);
        assertThat(kisiler1).isNotEqualTo(kisiler2);
        kisiler1.setId(null);
        assertThat(kisiler1).isNotEqualTo(kisiler2);
    }
}
