package com.koop.app.repository;

import com.koop.app.domain.Kisiler;
import com.koop.app.domain.Satis;
import com.koop.app.dto.Ciro;
import com.koop.app.dto.fatura.ReportDatesDto;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.javers.spring.annotation.JaversSpringDataAuditable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Satis entity.
 */
@SuppressWarnings("unused")
@Repository
@JaversSpringDataAuditable
public interface SatisRepository extends JpaRepository<Satis, Long> {
    String SATISLAR_BY_ID_CACHE = "satislarById";

    @Query("select satis from Satis satis where satis.user.login = ?#{principal.username}")
    List<Satis> findByUserIsCurrentUser();

    @Query("select satis from Satis satis where satis.user.login like concat('%',:login,'%')")
    Page<Satis> findSatisByLogin(@Param("login") String login, Pageable pageable);

    @Query("select satis.id from Satis satis")
    Page<Long> findAllIds(Pageable var1);

    @Query("select satis.id from Satis satis")
    List<Long> findAllIds();

    @Query("select satis from Satis satis join fetch satis.stokHareketleriLists sth where satis.id in :ids")
    List<Satis> findAllByIds(@Param("ids") List<Long> ids, Sort sort);

    @Query("select satis from Satis satis join fetch satis.stokHareketleriLists where satis.id in :ids")
    List<Satis> findAllByIds(@Param("ids") Set<Long> ids);

    @Query("select satis from Satis satis left join fetch satis.stokHareketleriLists where satis.id = :id")
    Optional<Satis> findOneWithStokHareketleriById(@Param("id") Long id);

    @Query("select sum(satis.toplamTutar) from Satis satis where satis.tarih between :yesterday and :today")
    Double findCiro(@Param("today") ZonedDateTime today, @Param("yesterday") ZonedDateTime yesterday);

    @Query(
        "select sum(satis.toplamTutar) from Satis satis where satis.tarih between :yesterday and :today and satis.kartliSatis = true"
    )
    Double findCiroKartli(@Param("today") ZonedDateTime today, @Param("yesterday") ZonedDateTime yesterday);

    @Query(
        "select new com.koop.app.dto.Ciro(" +
        "sum(satis.toplamTutar) as toplam," +
        "sum(case when satis.kartliSatis = true then satis.toplamTutar else 0 end) as kartli," +
        "sum(case when satis.kartliSatis = false then satis.toplamTutar when satis.kartliSatis is null then satis.toplamTutar else 0 end)," +
        " cast(satis.tarih as date)" +
        ") " +
        "from Satis satis " +
        "where satis.tarih between :from and :to " +
        "group by cast(satis.tarih as date) " +
        "order by cast(satis.tarih as date)"
    )
    List<Ciro> getCiroReports(@Param("from") ZonedDateTime from, @Param("to") ZonedDateTime to);

    @Query(
        "select new com.koop.app.dto.fatura.ReportDatesDto(" +
        "concat(year(satis.tarih), '-', month(satis.tarih))" +
        ") " +
        "from Satis satis " +
        "group by month(satis.tarih), year(satis.tarih) " +
        "order by year(satis.tarih) desc, month(satis.tarih) desc"
    )
    List<ReportDatesDto> getOrtaklarFaturaDatesTop10(Pageable pageable);

    @Query(
        "select distinct satis.kisi " +
        "from Satis satis " +
        "where month(satis.tarih) = :month and year(satis.tarih) = :year "
    )
    List<Kisiler> ortakFaturaKisiList(@Param("year") int year, @Param("month") int month);

    @Query(
        "select new com.koop.app.dto.Ciro(" +
        "sum(satis.toplamTutar) as toplam," +
        "sum(case when satis.kartliSatis = true then satis.toplamTutar else 0 end) as kartli," +
        "sum(case when satis.kartliSatis = false then satis.toplamTutar when satis.kartliSatis is null then satis.toplamTutar else 0 end), " +
        "cast(satis.tarih as date), " +
        "satis.user.login" +
        ") " +
        "from Satis satis " +
        "where satis.tarih between :from and :to " +
        "group by cast(satis.tarih as date), satis.user.login " +
        "order by cast(satis.tarih as date) desc"
    )
    List<Ciro> getCiroReportGroupByNobetci(@Param("from") ZonedDateTime from, @Param("to") ZonedDateTime to);

    @Query(
        "select new com.koop.app.dto.Ciro(" +
        "sum(satis.toplamTutar) as toplam," +
        "sum(case when satis.kartliSatis = true then satis.toplamTutar else 0 end) as kartli," +
        "sum(case when satis.kartliSatis = false then satis.toplamTutar when satis.kartliSatis is null then satis.toplamTutar else 0 end), " +
        "cast(satis.tarih as date), " +
        "satis.user.login" +
        ") " +
        "from Satis satis " +
        "where satis.tarih between :from and :to " +
        "and satis.user.id = :userId " +
        "group by cast(satis.tarih as date), satis.user.login " +
        "order by cast(satis.tarih as date) desc"
    )
    Ciro getCiroReportGroupByNobetciAndDate(
        @Param("from") ZonedDateTime from,
        @Param("to") ZonedDateTime to,
        @Param("userId") Long userId
    );
    //    @Query("select satis from Satis satis left join fetch satis.user")
    //    Page<Satis> findAllSatis(Pageable pageable);

    //    @Query(
    //        "select satis.stokHareketleriLists. " +
    //            "from Satis satis " +
    //            "join fetch satis.stokHareketleriLists st" +
    //            "where month(satis.tarih) = :month and year(satis.tarih) = :year and satis.kisi.id = :kisiId"
    //    )
    //    List<Satis> ortakFaturaKisiAy(@Param("year") int year, @Param("month") int month,  @Param("kisiId") Long kisiId);
}
