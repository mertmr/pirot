package com.koop.app.repository;

import com.koop.app.domain.NobetHareketleri;
import org.javers.spring.annotation.JaversSpringDataAuditable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the NobetHareketleri entity.
 */
@SuppressWarnings("unused")
@Repository
@JaversSpringDataAuditable
public interface NobetHareketleriRepository extends JpaRepository<NobetHareketleri, Long> {

}
