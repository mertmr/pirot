package com.koop.app.repository;

import com.koop.app.domain.Gider;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;
import org.javers.spring.annotation.JaversSpringDataAuditable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Gider entity.
 */
@SuppressWarnings("unused")
@Repository
@JaversSpringDataAuditable
public interface GiderRepository extends JpaRepository<Gider, Long> {
    @Query("select gider from Gider gider where gider.user.login = ?#{principal.username}")
    List<Gider> findByUserIsCurrentUser();

    @Query("select sum(gider.tutar) from Gider gider where gider.odemeAraci='2'")
    Double findAllGiderTutar();

    @Query("select gider from Gider gider where gider.user.login like concat('%',:login,'%')")
    Page<Gider> search(@Param("login") String login, Pageable pageable);
}
