package com.derdimet.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Slf4j
@Component
@Profile("prod")
@RequiredArgsConstructor
public class ProductionEnvironmentValidator {

    private static final String DEV_JWT_FALLBACK = "derdimet-local-dev-only-change-in-env-32ch";

    private final Environment environment;

    @EventListener(ApplicationReadyEvent.class)
    void validate() {
        require("SPRING_DATASOURCE_URL", environment.getProperty("spring.datasource.url"));
        require("SPRING_DATASOURCE_USERNAME", environment.getProperty("spring.datasource.username"));
        require("SPRING_DATASOURCE_PASSWORD", environment.getProperty("spring.datasource.password"));
        require("DERDIMET_JWT_SECRET", environment.getProperty("derdimet.jwt.secret"));

        String jwtSecret = environment.getProperty("derdimet.jwt.secret", "");
        if (jwtSecret.length() < 32) {
            throw new IllegalStateException("DERDIMET_JWT_SECRET en az 32 karakter olmalıdır");
        }
        if (DEV_JWT_FALLBACK.equals(jwtSecret)) {
            throw new IllegalStateException("Üretimde geliştirme JWT anahtarı kullanılamaz");
        }

        String cors = environment.getProperty("derdimet.cors.allowed-origin-patterns", "");
        if (!StringUtils.hasText(cors) || "*".equals(cors.trim())) {
            throw new IllegalStateException(
                    "DERDIMET_CORS_ALLOWED_ORIGIN_PATTERNS üretimde açıkça tanımlanmalıdır (joker * yasak)");
        }

        if (Boolean.parseBoolean(environment.getProperty("derdimet.seed.enabled", "false"))) {
            throw new IllegalStateException("DERDIMET_SEED üretim ortamında etkinleştirilemez");
        }

        log.info("Üretim ortam değişkenleri doğrulandı");
    }

    private static void require(String name, String value) {
        if (!StringUtils.hasText(value)) {
            throw new IllegalStateException("Zorunlu ortam değişkeni eksik: " + name);
        }
    }
}
