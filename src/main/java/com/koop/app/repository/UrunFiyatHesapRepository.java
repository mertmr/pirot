package com.koop.app.repository;

import com.koop.app.domain.UrunFiyatHesap;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the UrunFiyatHesap entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UrunFiyatHesapRepository extends JpaRepository<UrunFiyatHesap, Long> {
}
