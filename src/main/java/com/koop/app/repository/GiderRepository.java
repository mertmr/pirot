package com.koop.app.repository;

import com.koop.app.domain.Gider;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Gider entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GiderRepository extends JpaRepository<Gider, Long> {

    @Query("select gider from Gider gider where gider.user.login = ?#{principal.username}")
    List<Gider> findByUserIsCurrentUser();
}
