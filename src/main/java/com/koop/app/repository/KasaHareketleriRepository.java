package com.koop.app.repository;

import com.koop.app.domain.KasaHareketleri;
import org.javers.spring.annotation.JaversSpringDataAuditable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the KasaHareketleri entity.
 */
@SuppressWarnings("unused")
@Repository
@JaversSpringDataAuditable
public interface KasaHareketleriRepository extends JpaRepository<KasaHareketleri, Long> {
    KasaHareketleri findFirstByOrderByTarihDesc();
}
