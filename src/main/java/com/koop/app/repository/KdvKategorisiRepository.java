package com.koop.app.repository;

import com.koop.app.domain.KdvKategorisi;
import org.javers.spring.annotation.JaversSpringDataAuditable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the KdvKategorisi entity.
 */
@SuppressWarnings("unused")
@Repository
@JaversSpringDataAuditable
public interface KdvKategorisiRepository extends JpaRepository<KdvKategorisi, Long> {

}
