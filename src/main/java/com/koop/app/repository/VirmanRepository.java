package com.koop.app.repository;

import com.koop.app.domain.Virman;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.List;
import org.javers.spring.annotation.JaversSpringDataAuditable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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

    @Query("select virman from Virman virman where virman.user.login like concat('%',:login,'%')")
    Page<Virman> search(@Param("login") String login, Pageable pageable);

    @Query(
        "select virman from Virman virman where virman.tarih between :from and :to " + "and virman.user.id = :userId"
    )
    Virman getUserVirman(
        @Param("from") ZonedDateTime from,
        @Param("to") ZonedDateTime to,
        @Param("userId") Long userId
    );

    @Query("select virman from Virman virman where virman.tarih between :from and :to")
    Virman findVirmanByGun(@Param("from") ZonedDateTime from, @Param("to") ZonedDateTime to);
}
