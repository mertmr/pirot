package com.koop.app.repository;

import com.koop.app.domain.Satis;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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
    Page<Integer> findAllIds(Pageable var1);

    @EntityGraph(attributePaths = "stokHareketleriLists.tutar")
    @Query("select satis from Satis satis where satis.id in :ids")
    List<Satis> findAllByIds(@Param("ids") List<Integer> ids);

    @EntityGraph(attributePaths = "stokHareketleriLists")
    Optional<Satis> findOneWithStokHareketleriById(Long id);

    @Query("select satis.id from Satis satis where satis.tarih between :today and :yesterday")
    List<Integer> findAllIdsToday(@Param("today") ZonedDateTime today, @Param("yesterday") ZonedDateTime yesterday);
}
