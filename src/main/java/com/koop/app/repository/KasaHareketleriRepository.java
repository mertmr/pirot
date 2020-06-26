package com.koop.app.repository;

import com.koop.app.domain.KasaHareketleri;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import org.javers.spring.annotation.JaversSpringDataAuditable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the KasaHareketleri entity.
 */
@SuppressWarnings("unused")
@Repository
@JaversSpringDataAuditable
public interface KasaHareketleriRepository extends JpaRepository<KasaHareketleri, Long> {
    KasaHareketleri findFirstByOrderByTarihDesc();

    @Query(
        "select kh from KasaHareketleri kh where kh.tarih = " +
        "(select max(khs.tarih) from KasaHareketleri khs where khs.tarih < :localDate)"
    )
    KasaHareketleri findFirstByOrderByTarihDesc(@Param("localDate") ZonedDateTime localDate);
}
