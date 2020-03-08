package com.koop.app.repository;

import com.koop.app.domain.BorcAlacak;
import java.util.List;
import org.javers.spring.annotation.JaversSpringDataAuditable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the BorcAlacak entity.
 */
@SuppressWarnings("unused")
@Repository
@JaversSpringDataAuditable
public interface BorcAlacakRepository extends JpaRepository<BorcAlacak, Long> {
    @Query("select borcAlacak from BorcAlacak borcAlacak where borcAlacak.user.login = ?#{principal.username}")
    List<BorcAlacak> findByUserIsCurrentUser();
}
