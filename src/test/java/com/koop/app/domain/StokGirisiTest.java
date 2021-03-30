package com.koop.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.koop.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class StokGirisiTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(StokGirisi.class);
        StokGirisi stokGirisi1 = new StokGirisi();
        stokGirisi1.setId(1L);
        StokGirisi stokGirisi2 = new StokGirisi();
        stokGirisi2.setId(stokGirisi1.getId());
        assertThat(stokGirisi1).isEqualTo(stokGirisi2);
        stokGirisi2.setId(2L);
        assertThat(stokGirisi1).isNotEqualTo(stokGirisi2);
        stokGirisi1.setId(null);
        assertThat(stokGirisi1).isNotEqualTo(stokGirisi2);
    }
}
