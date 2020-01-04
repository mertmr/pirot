package com.koop.app.repository;

import com.koop.app.domain.SatisStokHareketleri;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the SatisStokHareketleri entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SatisStokHareketleriRepository extends JpaRepository<SatisStokHareketleri, Long> {

    @Query("select sum(satisStokHareketleri.tutar) from SatisStokHareketleri satisStokHareketleri")
    Double findAllTutar();
}
