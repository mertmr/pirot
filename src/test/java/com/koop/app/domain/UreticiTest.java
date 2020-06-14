package com.koop.app.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.koop.app.web.rest.TestUtil;

public class UreticiTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Uretici.class);
        Uretici uretici1 = new Uretici();
        uretici1.setId(1L);
        Uretici uretici2 = new Uretici();
        uretici2.setId(uretici1.getId());
        assertThat(uretici1).isEqualTo(uretici2);
        uretici2.setId(2L);
        assertThat(uretici1).isNotEqualTo(uretici2);
        uretici1.setId(null);
        assertThat(uretici1).isNotEqualTo(uretici2);
    }
}
