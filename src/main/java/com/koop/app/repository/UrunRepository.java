package com.koop.app.repository;

import com.koop.app.domain.Urun;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Urun entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UrunRepository extends JpaRepository<Urun, Long> {

    @Query("select urun from Urun urun where urun.user.login = ?#{principal.username}")
    List<Urun> findByUserIsCurrentUser();

}
