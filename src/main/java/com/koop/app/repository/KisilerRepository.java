package com.koop.app.repository;

import com.koop.app.domain.Kisiler;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Kisiler entity.
 */
@SuppressWarnings("unused")
@Repository
public interface KisilerRepository extends JpaRepository<Kisiler, Long> {

}
