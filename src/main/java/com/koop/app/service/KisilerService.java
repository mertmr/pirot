package com.koop.app.service;

import com.koop.app.domain.Kisiler;
import javax.persistence.EntityManager;
import javax.persistence.Query;
import org.springframework.stereotype.Service;

@Service
public class KisilerService {

    private final EntityManager em;

    public KisilerService(EntityManager em) {
        this.em = em;
    }

    public Kisiler getRandomKisi() {
        String sql = "select kisiler from Kisiler kisiler where kisiler.active=true order by function('RAND')";
        Query query = em.createQuery(sql);
        return (Kisiler) query.setMaxResults(1).setFirstResult(0).getSingleResult();
    }
}
