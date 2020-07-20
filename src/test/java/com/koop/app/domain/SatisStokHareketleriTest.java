package com.koop.app.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.koop.app.web.rest.TestUtil;

public class SatisStokHareketleriTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SatisStokHareketleri.class);
        SatisStokHareketleri satisStokHareketleri1 = new SatisStokHareketleri();
        satisStokHareketleri1.setId(1L);
        SatisStokHareketleri satisStokHareketleri2 = new SatisStokHareketleri();
        satisStokHareketleri2.setId(satisStokHareketleri1.getId());
        assertThat(satisStokHareketleri1).isEqualTo(satisStokHareketleri2);
        satisStokHareketleri2.setId(2L);
        assertThat(satisStokHareketleri1).isNotEqualTo(satisStokHareketleri2);
        satisStokHareketleri1.setId(null);
        assertThat(satisStokHareketleri1).isNotEqualTo(satisStokHareketleri2);
    }
}
