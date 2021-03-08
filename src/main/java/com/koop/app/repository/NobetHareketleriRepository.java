package com.koop.app.repository;

import com.koop.app.domain.NobetHareketleri;
import java.time.ZonedDateTime;
import java.util.List;

import org.javers.spring.annotation.JaversSpringDataAuditable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the NobetHareketleri entity.
 */
@SuppressWarnings("unused")
@Repository
@JaversSpringDataAuditable
public interface NobetHareketleriRepository extends JpaRepository<NobetHareketleri, Long> {
    @Query(
        "select nobetHareketleri from NobetHareketleri nobetHareketleri where nobetHareketleri.user.login = ?#{principal.username}"
    )
    List<NobetHareketleri> findByUserIsCurrentUser();

    @Query(
        "select kh from NobetHareketleri kh where kh.tarih = " +
        "(select max(khs.tarih) from NobetHareketleri khs where khs.tarih < :localDate)"
    )
    NobetHareketleri findLastNobetHareketiByTarih(@Param("localDate") ZonedDateTime endOfDay);

    @Query(
        "select kh from NobetHareketleri kh where kh.user.id = :userId and " +
        "kh.acilisKapanis = 'ACILIS' and kh.tarih between :from and :to"
    )
    NobetHareketleri findLastNobetHareketiAcilisByTarih(
        @Param("from") ZonedDateTime from,
        @Param("to") ZonedDateTime to,
        @Param("userId") Long userId
    );
}
