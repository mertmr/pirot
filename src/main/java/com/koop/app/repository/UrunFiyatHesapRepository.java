package com.koop.app.repository;

import com.koop.app.domain.UrunFiyatHesap;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data  repository for the UrunFiyatHesap entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UrunFiyatHesapRepository extends JpaRepository<UrunFiyatHesap, Long> {

    @Query("select urunFiyatHesap from UrunFiyatHesap urunFiyatHesap where urunFiyatHesap.urun.id = :urunId")
    Optional<UrunFiyatHesap> findByUrunId(@Param("urunId") Long urunId);
}
