package com.derdimet.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import java.util.List;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    private static final String BEARER_SCHEME = "bearerAuth";

    private static final List<String> PUBLIC_API_PATHS = List.of(
            "/api/auth/login",
            "/api/auth/session-login",
            "/api/register",
            "/api/auth/verification/send",
            "/api/auth/verification/confirm",
            "/api/auth/password/forgot",
            "/api/auth/password/reset");

    @Bean
    OpenAPI derdimEtOpenApi(@Value("${server.port:8081}") int serverPort) {
        return new OpenAPI()
                .info(new Info()
                        .title("derdimET API")
                        .description(
                                """
                                Türkiye odaklı çiftlikten sofraya et ve hayvan pazarı REST API.

                                **Kimlik doğrulama:** `POST /api/auth/login` ile JWT alın; korumalı uçlarda \
                                `Authorization: Bearer <token>` başlığını gönderin.

                                **Roller:** `MEAT_BUYER`, `ANIMAL_SELLER`, `SLAUGHTERHOUSE`, `ADMIN`
                                """)
                        .version("v1")
                        .contact(new Contact().name("derdimET").email("dev@derdimet.local"))
                        .license(new License().name("Proprietary")))
                .servers(List.of(new Server().url("http://localhost:" + serverPort).description("Yerel geliştirme")))
                .components(new Components()
                        .addSecuritySchemes(
                                BEARER_SCHEME,
                                new SecurityScheme()
                                        .name(BEARER_SCHEME)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("POST /api/auth/login yanıtındaki token")));
    }

    @Bean
    OpenApiCustomizer bearerAuthCustomizer() {
        SecurityRequirement requirement = new SecurityRequirement().addList(BEARER_SCHEME);
        return openApi -> openApi.getPaths().forEach((path, pathItem) -> {
            if (!path.startsWith("/api/") || isPublicPath(path)) {
                return;
            }
            pathItem.readOperations().forEach(operation -> operation.addSecurityItem(requirement));
        });
    }

    @Bean
    GroupedOpenApi allApi() {
        return GroupedOpenApi.builder()
                .group("all")
                .pathsToMatch("/api/**")
                .build();
    }

    @Bean
    GroupedOpenApi authApi() {
        return grouped("auth", "/api/auth/**", "/api/register");
    }

    @Bean
    GroupedOpenApi buyerApi() {
        return grouped("buyer", "/api/buyer/**");
    }

    @Bean
    GroupedOpenApi sellerApi() {
        return grouped("seller", "/api/seller/**");
    }

    @Bean
    GroupedOpenApi slaughterhouseApi() {
        return grouped("slaughterhouse", "/api/slaughterhouse/**");
    }

    @Bean
    GroupedOpenApi adminApi() {
        return grouped("admin", "/api/admin/**");
    }

    @Bean
    GroupedOpenApi sharedApi() {
        return grouped(
                "shared",
                "/api/me",
                "/api/me/**",
                "/api/listings/**",
                "/api/conversations",
                "/api/conversations/**",
                "/api/notifications/**",
                "/api/media/**",
                "/api/users/**",
                "/api/favorites/**");
    }

    private static GroupedOpenApi grouped(String name, String... paths) {
        return GroupedOpenApi.builder().group(name).pathsToMatch(paths).build();
    }

    private static boolean isPublicPath(String path) {
        return PUBLIC_API_PATHS.stream().anyMatch(path::equals);
    }
}
