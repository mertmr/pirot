package com.koop.app.repository;

import com.koop.app.domain.BorcAlacak;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the BorcAlacak entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BorcAlacakRepository extends JpaRepository<BorcAlacak, Long> {

    @Query("select borcAlacak from BorcAlacak borcAlacak where borcAlacak.user.login = ?#{principal.username}")
    List<BorcAlacak> findByUserIsCurrentUser();

}
