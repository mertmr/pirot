package com.koop.app.repository;

import com.koop.app.domain.SatisStokHareketleri;
import com.koop.app.dto.AylikSatislar;
import com.koop.app.dto.fatura.OrtakFaturaDbReport;
import org.javers.spring.annotation.JaversSpringDataAuditable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;

/**
 * Spring Data  repository for the SatisStokHareketleri entity.
 */
@SuppressWarnings("unused")
@Repository
@JaversSpringDataAuditable
public interface SatisStokHareketleriRepository extends JpaRepository<SatisStokHareketleri, Long> {
    @Query("select sum(satisStokHareketleri.tutar) from SatisStokHareketleri satisStokHareketleri")
    Double findAllTutar();

    @Query(
        "SELECT new com.koop.app.dto.AylikSatislar(year(s.tarih), " +
            "       month(s.tarih), " +
            "       u.urunAdi, " +
            "       sum(st.miktar)) " +
            "FROM SatisStokHareketleri st " +
            "         join Satis s on st.satis.id = s.id " +
            "         join Urun u on st.urun.id = u.id " +
            " where u.id = :id " +
            "GROUP BY year(s.tarih), month(s.tarih), u.urunAdi  " +
            "order by year(s.tarih), month(s.tarih) desc "
    )
    List<AylikSatislar> getSatisRaporlari(@Param("id") Long id);

    @Query(
        "select satisStokHareketleri from SatisStokHareketleri satisStokHareketleri " +
            "join fetch satisStokHareketleri.satis " +
            "join fetch satisStokHareketleri.urun"
    )
    List<SatisStokHareketleri> findAllWithSatis();

    @Query(
        "select new com.koop.app.dto.fatura.OrtakFaturaDbReport( " +
            "concat(u.urunAdi, ' %', kk.kdvOrani), sum(satisStokHareketleri.miktar), u, kk, " +
            "sum(satisStokHareketleri.tutar) " +
            ") " +
            "from SatisStokHareketleri satisStokHareketleri " +
            "join Urun u on u.id = satisStokHareketleri.urun.id " +
            "join KdvKategorisi kk on kk.id = satisStokHareketleri.urun.kdvKategorisi.id " +
            "where month(satisStokHareketleri.satis.tarih) = :month and year(satisStokHareketleri.satis.tarih) = :year " +
            "and satisStokHareketleri.satis.kisi.id = :kisiId " +
            "GROUP BY u.id, u.urunAdi, kk.id, u.birim  "
    )
    List<OrtakFaturaDbReport> ortakFaturaKisiAy(
        @Param("year") int year,
        @Param("month") int month,
        @Param("kisiId") Long kisiId
    );

    @Query(
        "SELECT sum(st.miktar) " +
            "FROM SatisStokHareketleri st " +
            "where st.satis.tarih >= :fromDate and st.satis.tarih <= :toDate and st.urun.id = :urunId " +
            "GROUP BY st.urun.id  "
    )
    long getSatisRaporlariToplamiByUrunAndTarih(@Param("fromDate") ZonedDateTime fromDate,
                                                @Param("toDate") ZonedDateTime toDate,
                                                @Param("urunId") Long urunId);

    @Query(
        "SELECT st " +
            "FROM SatisStokHareketleri st " +
            "left join fetch st.satis " +
            "where st.satis.tarih >= :fromDate and st.satis.tarih <= :toDate and st.urun.id = :urunId "
    )
    List<SatisStokHareketleri> getSatisRaporlariByUrunAndTarih(@Param("fromDate") ZonedDateTime fromDate,
                                                               @Param("toDate") ZonedDateTime toDate,
                                                               @Param("urunId") Long urunId);
}
