package com.koop.app.repository;

import com.koop.app.domain.Urun;
import java.util.List;
import org.javers.spring.annotation.JaversSpringDataAuditable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Urun entity.
 */
@SuppressWarnings("unused")
@Repository
@JaversSpringDataAuditable
public interface UrunRepository extends JpaRepository<Urun, Long> {
    @Query("select urun from Urun urun where urun.satista = true and urun.stok > 0")
    List<Urun> findSatistakiUrunler();

    Page<Urun> findByUrunAdiContainingIgnoreCase(String urunAdi, Pageable pageable);
}
