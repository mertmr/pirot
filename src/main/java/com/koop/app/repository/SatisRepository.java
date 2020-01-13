package com.koop.app.repository;

import com.koop.app.domain.Satis;
import com.koop.app.dto.Ciro;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the Satis entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SatisRepository extends JpaRepository<Satis, Long> {

    String SATISLAR_BY_ID_CACHE = "satislarById";

    @Query("select satis from Satis satis where satis.user.login = ?#{principal.username}")
    List<Satis> findByUserIsCurrentUser();

    @Query("select satis.id from Satis satis")
    Page<Long> findAllIds(Pageable var1);

    @Query("select satis.id from Satis satis")
    List<Long> findAllIds();

    @EntityGraph(attributePaths = "stokHareketleriLists.tutar")
    @Query("select satis from Satis satis where satis.id in :ids")
    List<Satis> findAllByIds(@Param("ids") List<Long> ids, Sort sort);

    @EntityGraph(attributePaths = "stokHareketleriLists.tutar")
    @Query("select satis from Satis satis where satis.id in :ids")
    List<Satis> findAllByIds(@Param("ids") List<Long> ids);

    @EntityGraph(attributePaths = "stokHareketleriLists")
    Optional<Satis> findOneWithStokHareketleriById(Long id);

    @Query("select satis.id from Satis satis where satis.tarih between :yesterday and :today")
    List<Long> findAllIdsToday(@Param("today") ZonedDateTime today, @Param("yesterday") ZonedDateTime yesterday);

    @Query("select sum(satis.toplamTutar) from Satis satis where satis.tarih between :yesterday and :today")
    Double findCiro(@Param("today") ZonedDateTime today, @Param("yesterday") ZonedDateTime yesterday);

    @Query("select new com.koop.app.dto.Ciro(sum(satis.toplamTutar), cast(satis.tarih as date)) " +
        "from Satis satis " +
        "where satis.tarih between :from and :to " +
        "group by cast(satis.tarih as date) " +
        "order by cast(satis.tarih as date)")
    List<Ciro> getCiroReports(@Param("from") LocalDate from, @Param("to") LocalDate to);
}
