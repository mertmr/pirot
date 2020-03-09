package com.koop.app.repository;

import com.koop.app.domain.Satis;
import com.koop.app.domain.Urun;
import com.koop.app.dto.Ciro;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import org.javers.spring.annotation.JaversSpringDataAuditable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.EntityGraph;
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

    @EntityGraph(attributePaths = "stokHareketleriLists.tutar")
    @Query("select satis from Satis satis where satis.id in :ids")
    List<Satis> findAllByIds(@Param("ids") List<Long> ids, Sort sort);

    @EntityGraph(attributePaths = "stokHareketleriLists.tutar")
    @Query("select satis from Satis satis where satis.id in :ids")
    List<Satis> findAllByIds(@Param("ids") List<Long> ids);

    @EntityGraph(attributePaths = "stokHareketleriLists")
    Optional<Satis> findOneWithStokHareketleriById(Long id);

    @Query("select sum(satis.toplamTutar) from Satis satis where satis.tarih between :yesterday and :today")
    Double findCiro(@Param("today") ZonedDateTime today, @Param("yesterday") ZonedDateTime yesterday);

    @Query("select sum(satis.toplamTutar) from Satis satis where satis.tarih between :yesterday and :today and satis.kartliSatis = true")
    Double findCiroKartli(@Param("today") ZonedDateTime today, @Param("yesterday") ZonedDateTime yesterday);

    @Query(
        "select new com.koop.app.dto.Ciro(sum(satis.toplamTutar), cast(satis.tarih as date)) " +
        "from Satis satis " +
        "where satis.tarih between :from and :to " +
        "group by cast(satis.tarih as date) " +
        "order by cast(satis.tarih as date) desc"
    )
    List<Ciro> getCiroReports(@Param("from") ZonedDateTime from, @Param("to") ZonedDateTime to);
}
