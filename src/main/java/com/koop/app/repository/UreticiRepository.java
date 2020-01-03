package com.koop.app.repository;

import com.koop.app.domain.Uretici;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Uretici entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UreticiRepository extends JpaRepository<Uretici, Long> {

    @Query("select uretici from Uretici uretici where uretici.user.login = ?#{principal.username}")
    List<Uretici> findByUserIsCurrentUser();

}
