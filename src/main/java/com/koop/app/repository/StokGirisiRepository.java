package com.koop.app.repository;

import com.koop.app.domain.StokGirisi;
import org.javers.spring.annotation.JaversSpringDataAuditable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
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

    @Query(
        "select stokGirisi from StokGirisi stokGirisi " +
            " left join fetch stokGirisi.user " +
            " where stokGirisi.urun.id=:id " +
            " and stokGirisi.stokHareketiTipi='STOK_GIRISI' " +
            " and stokGirisi.tarih>'2020-06-01 00:00:00.000000' " +
            " order by stokGirisi.id desc "
    )
    List<StokGirisi> findOnlyStokGirisiByUrun(@Param("id") Long id);

    @Query(
        "SELECT sum(st.miktar) " +
            "FROM StokGirisi st " +
            "where st.tarih >= :fromDate " +
            "and st.stokHareketiTipi = 'FIRE' " +
            "and st.tarih <= :toDate " +
            "and st.urun.id = :urunId "
    )
    BigDecimal getUrunFire(@Param("fromDate") ZonedDateTime fromDate,
                           @Param("toDate") ZonedDateTime toDate,
                           @Param("urunId") Long urunId);
}
