package com.koop.app.repository;

import com.koop.app.domain.Satis;
import com.koop.app.domain.UreticiOdemeleri;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

/**
 * Spring Data  repository for the UreticiOdemeleri entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UreticiOdemeleriRepository extends JpaRepository<UreticiOdemeleri, Long> {
    @Query("select ureticiOdemeleri from UreticiOdemeleri ureticiOdemeleri left join fetch ureticiOdemeleri.uretici where ureticiOdemeleri.uretici.id = :ureticiId")
    Optional<UreticiOdemeleri> findOneUreticiOdemeleriByUrun(@Param("ureticiId") Long ureticiId);

    @Query("select sum(ureticiOdemeleri.tutar) from UreticiOdemeleri ureticiOdemeleri")
    BigDecimal findTotalBorc();
}
