package com.koop.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.koop.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

public class GiderTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Gider.class);
        Gider gider1 = new Gider();
        gider1.setId(1L);
        Gider gider2 = new Gider();
        gider2.setId(gider1.getId());
        assertThat(gider1).isEqualTo(gider2);
        gider2.setId(2L);
        assertThat(gider1).isNotEqualTo(gider2);
        gider1.setId(null);
        assertThat(gider1).isNotEqualTo(gider2);
    }
}
