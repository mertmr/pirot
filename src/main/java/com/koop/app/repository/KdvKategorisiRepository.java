package com.koop.app.repository;

import com.koop.app.domain.KdvKategorisi;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the KdvKategorisi entity.
 */
@SuppressWarnings("unused")
@Repository
public interface KdvKategorisiRepository extends JpaRepository<KdvKategorisi, Long> {

}
