package com.koop.app.repository;

import com.koop.app.domain.Satis;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Satis entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SatisRepository extends JpaRepository<Satis, Long> {

    @Query("select satis from Satis satis where satis.user.login = ?#{principal.username}")
    List<Satis> findByUserIsCurrentUser();

}
