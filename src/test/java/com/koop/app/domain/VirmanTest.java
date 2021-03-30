package com.koop.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.koop.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class VirmanTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Virman.class);
        Virman virman1 = new Virman();
        virman1.setId(1L);
        Virman virman2 = new Virman();
        virman2.setId(virman1.getId());
        assertThat(virman1).isEqualTo(virman2);
        virman2.setId(2L);
        assertThat(virman1).isNotEqualTo(virman2);
        virman1.setId(null);
        assertThat(virman1).isNotEqualTo(virman2);
    }
}
