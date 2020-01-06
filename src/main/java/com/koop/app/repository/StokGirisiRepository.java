package com.koop.app.repository;

import com.koop.app.domain.StokGirisi;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the StokGirisi entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StokGirisiRepository extends JpaRepository<StokGirisi, Long> {

    @Query("select stokGirisi from StokGirisi stokGirisi where stokGirisi.user.login = ?#{principal.username}")
    List<StokGirisi> findByUserIsCurrentUser();

    @Query("select stokGirisi.urun.id from StokGirisi stokGirisi where stokGirisi.miktar>0 or stokGirisi.agirlik>0")
    List<Long> findStokWithMoreThanZero();
}
