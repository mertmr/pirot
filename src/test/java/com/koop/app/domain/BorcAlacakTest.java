package com.koop.app.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.koop.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BorcAlacakTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BorcAlacak.class);
        BorcAlacak borcAlacak1 = new BorcAlacak();
        borcAlacak1.setId(1L);
        BorcAlacak borcAlacak2 = new BorcAlacak();
        borcAlacak2.setId(borcAlacak1.getId());
        assertThat(borcAlacak1).isEqualTo(borcAlacak2);
        borcAlacak2.setId(2L);
        assertThat(borcAlacak1).isNotEqualTo(borcAlacak2);
        borcAlacak1.setId(null);
        assertThat(borcAlacak1).isNotEqualTo(borcAlacak2);
    }
}
