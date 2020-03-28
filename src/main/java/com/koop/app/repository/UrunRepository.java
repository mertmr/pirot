package com.koop.app.repository;

import com.koop.app.domain.Urun;
import java.util.List;
import org.javers.spring.annotation.JaversSpringDataAuditable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.lang.NonNull;
import org.springframework.lang.NonNullApi;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Urun entity.
 */
@SuppressWarnings("unused")
@Repository
@JaversSpringDataAuditable
public interface UrunRepository extends JpaRepository<Urun, Long> {
    @Query("select urun from Urun urun " +
        "left join fetch urun.urunFiyatHesap " +
        "left join fetch urun.kdvKategorisi " +
        " where urun.satista = true and urun.stok > 0 and urun.active=true")
    List<Urun> findSatistakiUrunler();

    Page<Urun> findByUrunAdiContainingIgnoreCaseAndActive(String urunAdi, Boolean active, Pageable pageable);

    @Override
    @Query("select urun from Urun urun where urun.active=true")
    Page<Urun> findAll(@NonNull Pageable var1);

    @Query("select urun from Urun urun left join fetch urun.urunFiyatHesap where urun.satista=true")
    List<Urun> getAllUrunForStokGirisi();
}
