package com.koop.app.repository;

import com.koop.app.domain.NobetHareketleri;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the NobetHareketleri entity.
 */
@SuppressWarnings("unused")
@Repository
public interface NobetHareketleriRepository extends JpaRepository<NobetHareketleri, Long> {

    @Query("select nobetHareketleri from NobetHareketleri nobetHareketleri where nobetHareketleri.user.login = ?#{principal.username}")
    List<NobetHareketleri> findByUserIsCurrentUser();
}
