package com.koop.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.koop.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

public class SatisTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Satis.class);
        Satis satis1 = new Satis();
        satis1.setId(1L);
        Satis satis2 = new Satis();
        satis2.setId(satis1.getId());
        assertThat(satis1).isEqualTo(satis2);
        satis2.setId(2L);
        assertThat(satis1).isNotEqualTo(satis2);
        satis1.setId(null);
        assertThat(satis1).isNotEqualTo(satis2);
    }
}
