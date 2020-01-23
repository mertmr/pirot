package com.koop.app.repository;

import com.koop.app.domain.Virman;
import org.javers.spring.annotation.JaversSpringDataAuditable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Virman entity.
 */
@SuppressWarnings("unused")
@Repository
@JaversSpringDataAuditable
public interface VirmanRepository extends JpaRepository<Virman, Long> {

    @Query("select virman from Virman virman where virman.user.login = ?#{principal.username}")
    List<Virman> findByUserIsCurrentUser();

    @Query("select sum(virman.tutar) from Virman virman where virman.cikisHesabi='2'")
    Double findAllVirman();
}
