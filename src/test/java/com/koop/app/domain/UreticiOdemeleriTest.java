package com.koop.app.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.koop.app.web.rest.TestUtil;

public class UreticiOdemeleriTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UreticiOdemeleri.class);
        UreticiOdemeleri ureticiOdemeleri1 = new UreticiOdemeleri();
        ureticiOdemeleri1.setId(1L);
        UreticiOdemeleri ureticiOdemeleri2 = new UreticiOdemeleri();
        ureticiOdemeleri2.setId(ureticiOdemeleri1.getId());
        assertThat(ureticiOdemeleri1).isEqualTo(ureticiOdemeleri2);
        ureticiOdemeleri2.setId(2L);
        assertThat(ureticiOdemeleri1).isNotEqualTo(ureticiOdemeleri2);
        ureticiOdemeleri1.setId(null);
        assertThat(ureticiOdemeleri1).isNotEqualTo(ureticiOdemeleri2);
    }
}
