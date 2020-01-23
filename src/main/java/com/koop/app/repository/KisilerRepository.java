package com.koop.app.repository;

import com.koop.app.domain.Kisiler;
import org.javers.spring.annotation.JaversSpringDataAuditable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Kisiler entity.
 */
@SuppressWarnings("unused")
@Repository
@JaversSpringDataAuditable
public interface KisilerRepository extends JpaRepository<Kisiler, Long> {

}
