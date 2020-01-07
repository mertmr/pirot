package com.koop.app.repository;

import com.koop.app.domain.KasaHareketleri;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the KasaHareketleri entity.
 */
@SuppressWarnings("unused")
@Repository
public interface KasaHareketleriRepository extends JpaRepository<KasaHareketleri, Long> {

    KasaHareketleri findFirstOrderByTarihDesc();
}
