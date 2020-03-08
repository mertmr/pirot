package com.koop.app.repository;

import com.koop.app.domain.UrunFiyat;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the UrunFiyat entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UrunFiyatRepository extends JpaRepository<UrunFiyat, Long> {
    @Query("select urunFiyat from UrunFiyat urunFiyat where urunFiyat.user.login = ?#{principal.username}")
    List<UrunFiyat> findByUserIsCurrentUser();
}
