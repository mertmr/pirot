package com.koop.app.config;

import com.github.benmanes.caffeine.jcache.configuration.CaffeineConfiguration;
import io.github.jhipster.config.JHipsterProperties;
import io.github.jhipster.config.cache.PrefixedKeyGenerator;
import java.util.OptionalLong;
import java.util.concurrent.TimeUnit;
import org.hibernate.cache.jcache.ConfigSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.boot.info.BuildProperties;
import org.springframework.boot.info.GitProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.*;

@Configuration
@EnableCaching
public class CacheConfiguration {
    private GitProperties gitProperties;
    private BuildProperties buildProperties;
    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Caffeine caffeine = jHipsterProperties.getCache().getCaffeine();

        CaffeineConfiguration<Object, Object> caffeineConfiguration = new CaffeineConfiguration<>();
        caffeineConfiguration.setMaximumSize(OptionalLong.of(caffeine.getMaxEntries()));
        caffeineConfiguration.setExpireAfterWrite(
            OptionalLong.of(TimeUnit.SECONDS.toNanos(caffeine.getTimeToLiveSeconds()))
        );
        caffeineConfiguration.setStatisticsEnabled(true);
        jcacheConfiguration = caffeineConfiguration;
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, com.koop.app.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, com.koop.app.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, com.koop.app.domain.User.class.getName());
            createCache(cm, com.koop.app.domain.Authority.class.getName());
            createCache(cm, com.koop.app.domain.User.class.getName() + ".authorities");
            createCache(cm, com.koop.app.domain.Gider.class.getName());
            createCache(cm, com.koop.app.domain.KdvKategorisi.class.getName());
            createCache(cm, com.koop.app.domain.Satis.class.getName());
            createCache(cm, com.koop.app.domain.SatisStokHareketleri.class.getName());
            createCache(cm, com.koop.app.domain.StokGirisi.class.getName());
            createCache(cm, com.koop.app.domain.Uretici.class.getName());
            createCache(cm, com.koop.app.domain.Urun.class.getName());
            createCache(cm, com.koop.app.domain.UrunFiyat.class.getName());
            createCache(cm, com.koop.app.domain.Virman.class.getName());
            createCache(cm, com.koop.app.domain.Satis.class.getName() + ".stokHareketleriLists");
            createCache(cm, com.koop.app.domain.BorcAlacak.class.getName());
            createCache(cm, com.koop.app.domain.KasaHareketleri.class.getName());
            createCache(cm, com.koop.app.domain.NobetHareketleri.class.getName());
            createCache(cm, com.koop.app.domain.Kisiler.class.getName());
            createCache(cm, com.koop.app.domain.UrunFiyatHesap.class.getName());
            createCache(cm, com.koop.app.domain.UreticiOdemeleri.class.getName());
            createCache(cm, com.koop.app.domain.Tenant.class.getName());
            // jhipster-needle-caffeine-add-entry
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache == null) {
            cm.createCache(cacheName, jcacheConfiguration);
        }
    }

    @Autowired(required = false)
    public void setGitProperties(GitProperties gitProperties) {
        this.gitProperties = gitProperties;
    }

    @Autowired(required = false)
    public void setBuildProperties(BuildProperties buildProperties) {
        this.buildProperties = buildProperties;
    }

    @Bean
    public KeyGenerator keyGenerator() {
        return new PrefixedKeyGenerator(this.gitProperties, this.buildProperties);
    }
}
