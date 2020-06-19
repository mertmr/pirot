package com.koop.app.repository;

import com.koop.app.domain.NobetHareketleri;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;

/**
 * Spring Data  repository for the NobetHareketleri entity.
 */
@SuppressWarnings("unused")
@Repository
public interface NobetHareketleriRepository extends JpaRepository<NobetHareketleri, Long> {

    @Query("select nobetHareketleri from NobetHareketleri nobetHareketleri where nobetHareketleri.user.login = ?#{principal.username}")
    List<NobetHareketleri> findByUserIsCurrentUser();

    @Query("select kh from NobetHareketleri kh where kh.tarih = " +
        "(select max(khs.tarih) from NobetHareketleri khs where khs.tarih < :localDate)")
    NobetHareketleri findLastNobetHareketiByTarih(@Param("localDate") ZonedDateTime endOfDay);
}
