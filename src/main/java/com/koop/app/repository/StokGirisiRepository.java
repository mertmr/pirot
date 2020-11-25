package com.koop.app.repository;

import com.koop.app.domain.StokGirisi;
import org.javers.spring.annotation.JaversSpringDataAuditable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the StokGirisi entity.
 */
@SuppressWarnings("unused")
@Repository
@JaversSpringDataAuditable
public interface StokGirisiRepository extends JpaRepository<StokGirisi, Long> {
    @Query("select stokGirisi from StokGirisi stokGirisi where stokGirisi.user.login = ?#{principal.username}")
    List<StokGirisi> findByUserIsCurrentUser();

    @Query(
        "select stokGirisi from StokGirisi stokGirisi " +
            " where lower(stokGirisi.urun.urunAdi) like lower(CONCAT('%',:query,'%'))"
    )
    Page<StokGirisi> findByUrunAdi(@Param("query") String query, Pageable pageable);
}
