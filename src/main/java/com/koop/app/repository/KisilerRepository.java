package com.koop.app.repository;

import com.koop.app.domain.Kisiler;
import org.javers.spring.annotation.JaversSpringDataAuditable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Kisiler entity.
 */
@SuppressWarnings("unused")
@Repository
@JaversSpringDataAuditable
public interface KisilerRepository extends JpaRepository<Kisiler, Long> {
    @Query("select count (kisiler.id) from Kisiler kisiler where kisiler.active=true")
    long countActive();

    @Query("select kisiler from Kisiler kisiler where kisiler.active=true")
    Page<Kisiler> findAllActive(Pageable var1);
}
