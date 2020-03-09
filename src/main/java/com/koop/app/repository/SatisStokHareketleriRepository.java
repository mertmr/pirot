package com.koop.app.repository;

import com.koop.app.domain.SatisStokHareketleri;
import com.koop.app.dto.AylikSatislar;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the SatisStokHareketleri entity.
 */
@SuppressWarnings("unused")
@Repository
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
        "GROUP BY year(s.tarih), month(s.tarih), u.urunAdi  " +
        "order by year(s.tarih), month(s.tarih) desc "
    )
    List<AylikSatislar> getSatisRaporlari();

    @Query("select satisStokHareketleri from SatisStokHareketleri satisStokHareketleri " +
        "join fetch satisStokHareketleri.satis " +
        "join fetch satisStokHareketleri.urun")
    List<SatisStokHareketleri> findAllWithSatis();
}
