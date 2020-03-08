package com.koop.app.repository;

import com.koop.app.domain.StokGirisi;
import java.util.List;
import org.javers.spring.annotation.JaversSpringDataAuditable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the StokGirisi entity.
 */
@SuppressWarnings("unused")
@Repository
@JaversSpringDataAuditable
public interface StokGirisiRepository extends JpaRepository<StokGirisi, Long> {
    @Query("select stokGirisi from StokGirisi stokGirisi where stokGirisi.user.login = ?#{principal.username}")
    List<StokGirisi> findByUserIsCurrentUser();
}
