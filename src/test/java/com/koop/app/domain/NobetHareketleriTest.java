package com.koop.app.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.koop.app.web.rest.TestUtil;

public class NobetHareketleriTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(NobetHareketleri.class);
        NobetHareketleri nobetHareketleri1 = new NobetHareketleri();
        nobetHareketleri1.setId(1L);
        NobetHareketleri nobetHareketleri2 = new NobetHareketleri();
        nobetHareketleri2.setId(nobetHareketleri1.getId());
        assertThat(nobetHareketleri1).isEqualTo(nobetHareketleri2);
        nobetHareketleri2.setId(2L);
        assertThat(nobetHareketleri1).isNotEqualTo(nobetHareketleri2);
        nobetHareketleri1.setId(null);
        assertThat(nobetHareketleri1).isNotEqualTo(nobetHareketleri2);
    }
}
